import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaWrench } from 'react-icons/fa';
import SoundSettingsPopup from './SoundSettingsPopup';
import sound from '../Assets/effect.mp3';
import '../Assets/kitchen.css';
import { formatDistanceToNow } from 'date-fns';

const socket = io('http://localhost:3001'); 

interface OrderItem {
  itemId: string;
  quantity: number;
  comment: string;
  item: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  };
}

interface Order {
  _id: string;
  table: {
    _id: string;
    tableNumber: string;
    capacity: number;
    createdAt: string;
    updatedAt: string;
  };
  items: OrderItem[];
  status: string;
  createdAt: string;  
  updatedAt: string;  
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('pending');
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
      const response = await fetch(`http://localhost:3001/api/admin/orders${statusQuery}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'complete' }), 
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
      audio.play().catch(error => {
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
          className={`btn ${filter === 'complete' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('complete')}
        >
          Complete Orders
        </button>
      </div>

      <button 
        className="btn btn-secondary mb-3" 
        onClick={togglePopup}
      >
        <FaWrench /> Settings
      </button>

      {popupVisible && <SoundSettingsPopup onClose={togglePopup} />}

      {orders.length > 0 ? (
        <ul className="list-group mt-4">
          {orders.map(order => (
            <li key={order._id} className="list-group-item">
              <h5>Table: {order.table.tableNumber}</h5>
              <ul>
                {order.items.map(item => (
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
                  className="btn btn-success"
                  onClick={() => handleStatusChange(order._id)}
                >
                  Mark as Complete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrderList;
