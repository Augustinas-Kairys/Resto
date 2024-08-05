import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  table: {
    type: Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  items: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    comment: {
      type: String, 
      default: ''  
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

const Order = model('Order', orderSchema);

export default Order;
