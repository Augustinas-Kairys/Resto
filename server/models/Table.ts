import mongoose, { Schema, Document } from 'mongoose';

export interface TableDocument extends Document {
  tableNumber: string;  
  capacity: number;    
}

const tableSchema = new Schema<TableDocument>({
  tableNumber: {
    type: String,      
    required: true,    
    unique: true      
  },
  capacity: {
    type: Number,      
    required: true     
  }
}, { timestamps: true }); 

const Table = mongoose.model<TableDocument>('Table', tableSchema);

export default Table;
