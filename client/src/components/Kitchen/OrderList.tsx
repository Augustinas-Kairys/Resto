import  { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaWrench } from 'react-icons/fa';
import SoundSettingsPopup from './SoundSettingsPopup';
import sound from '../Assets/effect.mp3';
import '../Assets/kitchen.css';
import { formatDistanceToNow, format } from 'date-fns';

import { Order } from '../Utils/types';

const socket = io('http://localhost:3001');

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'complete'>('pending');
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    fetchOrders();

    socket.on('refreshOrders', () => {
      fetchOrders();
      playNotificationSound();
    });

    return () => {
      socket.off('refreshOrders');
    };
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const statusQuery = filter === 'all' ? '' : `?status=${filter}`;
      const response = await fetch(`http://localhost:3001/api/orders${statusQuery}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'accepted' | 'complete') => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const playNotificationSound = () => {
    if (window.localStorage.getItem('isMuted') !== 'true') {
      const audio = new Audio(sound);
      audio.volume = parseFloat(window.localStorage.getItem('volume') || '1');
      audio.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Group completed orders by date
  const groupOrdersByDate = (orders: Order[]) => {
    return orders.reduce((acc, order) => {
      const orderDate = format(new Date(order.createdAt), 'yyyy-MM-dd'); // Format the order date
      if (!acc[orderDate]) {
        acc[orderDate] = [];
      }
      acc[orderDate].push(order);
      return acc;
    }, {} as Record<string, Order[]>);
  };

  const groupedCompletedOrders = groupOrdersByDate(
    orders.filter((order) => order.status === 'complete')
  );

  return (
    <div className="container mt-4">
      <h2>Order List</h2>

      <div className="mb-3">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => setFilter('pending')}
        >
          Pending Orders
        </button>
        <button
          className={`btn ${filter === 'accepted' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => setFilter('accepted')}
        >
          Accepted Orders
        </button>
        <button
          className={`btn ${filter === 'complete' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('complete')}
        >
          Complete Orders
        </button>
      </div>

      <button className="btn btn-secondary mb-3" onClick={togglePopup}>
        <FaWrench /> Settings
      </button>

      {popupVisible && <SoundSettingsPopup onClose={togglePopup} />}

      {filter === 'complete' && Object.keys(groupedCompletedOrders).length > 0 ? (
        Object.entries(groupedCompletedOrders).map(([date, orders]) => (
          <div key={date} className="mb-4">
            <h4 className="text-primary">{format(new Date(date), 'MMMM dd, yyyy')}</h4>
            <ul className="list-group mt-2">
              {orders.map((order) => (
                <li key={order._id} className="list-group-item">
                  <h5>Table: {order.table.tableNumber}</h5>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${item.item._id}-${item.item.name}`}>
                        {item.item.name}
                        {item.comment && ` (Comment: ${item.comment})`}
                      </li>
                    ))}
                  </ul>
                  <p>Completed at: {formatTimeAgo(order.createdAt)}</p>
                  <p>Status: {order.status}</p>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ul className="list-group mt-4">
          {orders.map((order) => (
            <li key={order._id} className="list-group-item">
              <h5>Table: {order.table.tableNumber}</h5>
              <ul>
                {order.items.map((item) => (
                  <li key={`${item.item._id}-${item.item.name}`}>
                    {item.item.name}
                    {item.comment && ` (Comment: ${item.comment})`}
                  </li>
                ))}
              </ul>
              <p>Created at: {formatTimeAgo(order.createdAt)}</p>
              <p>Status: {order.status}</p>

              {order.status === 'pending' && (
                <button
                  className="btn btn-warning"
                  onClick={() => handleStatusChange(order._id, 'accepted')}
                >
                  Mark as Accepted
                </button>
              )}

              {order.status === 'accepted' && (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusChange(order._id, 'complete')}
                >
                  Mark as Complete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
