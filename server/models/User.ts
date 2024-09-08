import { Document, Schema, Model, model } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'user' | 'admin'; 
}

const userSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  profilePicture: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User: Model<UserDocument> = model<UserDocument>('User', userSchema);

export default User;
