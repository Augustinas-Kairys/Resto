import React, { useState, useEffect } from 'react';

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
  status: string; // e.g., 'pending', 'complete'
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('pending');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const statusQuery = filter === 'all' ? '' : `?status=${filter}`;
      const response = await fetch(`http://localhost:3001/api/admin/orders${statusQuery}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched orders data:', data);
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

      {orders.length > 0 ? (
        <ul className="list-group">
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
