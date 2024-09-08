import  { useState, useEffect } from 'react';
import MenuItemForm from './MenuItemForm';
import MenuItemList from './MenuItemList';
import { MenuItem } from '../Utils/types';

const Admin: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data: MenuItem[] = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div>
      <h1>Admin Menu Management</h1>
      <MenuItemList 
        items={items}
        onEdit={handleEdit}
        onDelete={fetchMenuItems}
      />
      <MenuItemForm 
        fetchMenuItems={fetchMenuItems} 
        editingItem={editingItem} 
        onCancel={handleCancelEdit}
      />
    </div>
  );
};

export default Admin;
