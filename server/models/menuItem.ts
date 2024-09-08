import mongoose, { Schema, Document } from 'mongoose';

export interface MenuItemDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  imageUrl?: string; 
}

const menuItemSchema = new Schema<MenuItemDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Meals', 'Appetizers', 'Drinks'] },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String } 
});

const MenuItem = mongoose.model<MenuItemDocument>('MenuItem', menuItemSchema);

export default MenuItem;
