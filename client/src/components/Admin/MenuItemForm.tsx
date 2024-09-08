import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MenuItem } from '../Utils/types';

interface MenuItemFormProps {
  fetchMenuItems: () => void;
  editingItem: MenuItem | null;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ fetchMenuItems, editingItem, onCancel }) => {
  const [newItem, setNewItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'Meals',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (editingItem) {
      setNewItem(editingItem);
    } else {
      setNewItem({ name: '', description: '', price: 0, category: 'Meals' });
    }
  }, [editingItem]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price.toString());
    formData.append('category', newItem.category);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `http://localhost:3001/api/menu/${editingItem._id}` : 'http://localhost:3001/api/menu';
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to submit menu item');
      await fetchMenuItems();
      setImageFile(null);
      onCancel();
    } catch (error) {
      console.error('Error submitting menu item:', error);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Name"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Description"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Price"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="Meals">Meals</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingItem ? 'Update Item' : 'Add Item'}
        </button>
        {editingItem && (
          <button type="button" onClick={onCancel} className="btn btn-secondary ms-2">
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default MenuItemForm;
