import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const OrderForm: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [items, setMenuItems] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Meals');
  const [comment, setComment] = useState<string>(''); 
  const [commentIndex, setCommentIndex] = useState<number | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error fetching menu items:', error));
  }, []);

  useEffect(() => {
    socket.on('orderUpdated', (order) => {
      console.log('Order updated:', order);
    });

    return () => {
      socket.off('orderUpdated');
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (orderItems.length === 0) {
      setError('You must add at least one item to the order before submitting.');
      return;
    }

    setError(null); 
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table: tableId, items: orderItems }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      socket.emit('newOrder', { table: tableId, items: orderItems });

      navigate('/waiter/tables');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleAddItem = (item: any, event: React.MouseEvent) => {
    event.preventDefault();
    setOrderItems(prevItems => [
      ...prevItems,
      { item: item._id, quantity: 1, comment: '' } 
    ]);
  };

  const handleRemoveItem = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setOrderItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleCommentSave = (index: number) => {
    setOrderItems(prevItems =>
      prevItems.map((orderItem, i) =>
        i === index ? { ...orderItem, comment } : orderItem
      )
    );
    setComment(''); 
    setCommentIndex(null); 
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredItems = items.filter(item => item.category === selectedCategory);

  const getItemName = (itemId: string) => {
    const item = items.find(item => item._id === itemId);
    return item ? item.name : 'Unknown';
  };

  const getItemPrice = (itemId: string) => {
    const item = items.find(item => item._id === itemId);
    return item ? item.price : 0;
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, orderItem) => {
      const price = getItemPrice(orderItem.item);
      return total + price * orderItem.quantity;
    }, 0).toFixed(2); 
  };

  return (
    <div className="container mt-4">
      <h2>Create Order for Table {tableId}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <button
          className={`btn ${selectedCategory === 'Meals' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleCategoryChange('Meals')}
        >
          Meals
        </button>
        <button
          className={`btn ${selectedCategory === 'Appetizers' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleCategoryChange('Appetizers')}
        >
          Appetizers
        </button>
        <button
          className={`btn ${selectedCategory === 'Drinks' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleCategoryChange('Drinks')}
        >
          Drinks
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item._id} className="mb-3">
              <div className="d-flex align-items-center">
                {item.imageUrl && (
                  <img 
                    src={`http://localhost:3001/uploads/${item.imageUrl}`} 
                    alt={item.name} 
                    className="img-thumbnail ms-2" 
                    style={{ width: '100px' }} 
                  />
                )}
                <span className="me-2">{item.name} - ${item.price}</span>
                <button
                  type="button" 
                  className="btn btn-primary ms-2"
                  onClick={(event) => handleAddItem(item, event)}
                >
                  Add
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No items available for the selected category.</p>
        )}

        <div className="mt-4">
          <h4>Order Summary</h4>
          {orderItems.length > 0 ? (
            <ul className="list-group">
              {orderItems.map((orderItem, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {getItemName(orderItem.item)} - Quantity: {orderItem.quantity} - ${getItemPrice(orderItem.item) * orderItem.quantity}
                    {orderItem.comment && ` (Comment: ${orderItem.comment})`}
                  </span>
                  {commentIndex === index ? (
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Add comment"
                        className="form-control ms-2"
                        style={{ width: '200px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-success btn-sm ms-2"
                        onClick={() => handleCommentSave(index)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button" 
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setComment(orderItem.comment || ''); 
                        setCommentIndex(index); 
                      }}
                    >
                      Add/Edit Comment
                    </button>
                  )}
                  <button
                    type="button" 
                    className="btn btn-danger btn-sm ms-2"
                    onClick={(event) => handleRemoveItem(index, event)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              <li className="list-group-item active">
                <strong>Total: ${calculateTotal()}</strong>
              </li>
            </ul>
          ) : (
            <p>No items in the order.</p>
          )}
        </div>

        <button type="submit" className="btn btn-success mt-4">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
