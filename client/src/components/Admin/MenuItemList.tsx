import  { useState } from 'react';
import { MenuItem } from '../Utils/types';

interface MenuItemListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const categories = ['All', 'Meals', 'Appetizers', 'Drinks']; // Predefined categories

const MenuItemList: React.FC<MenuItemListProps> = ({ items, onEdit, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete menu item');
      onDelete(id);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  // Filter items based on the selected category
  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="container mt-4">
      {/* Category Filter Dropdown */}
      <div className="mb-3">
        <select 
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Item List */}
      <ul className="list-group">
        {filteredItems.map((item) => (
          <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{item.name}</strong>
              <p className="mb-1">{item.description}</p>
              <small>${item.price} - {item.category}</small>
              {item.imageUrl && (
                <img 
                  src={`http://localhost:3001/uploads/${item.imageUrl}`} 
                  alt={item.name} 
                  className="img-thumbnail mt-2" 
                  style={{ width: '100px' }} 
                />
              )}
            </div>
            <div>
              <button 
                className="btn btn-primary btn-sm me-2" 
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleDelete(item._id!)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItemList;
