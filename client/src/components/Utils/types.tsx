export interface OrderItem {
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

export interface Order {
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

export interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'Meals' | 'Appetizers' | 'Drinks';
  imageUrl?: string;
}
