export interface MenuItem {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: 'Meals' | 'Appetizers' | 'Drinks';
    imageUrl?: string;
  }