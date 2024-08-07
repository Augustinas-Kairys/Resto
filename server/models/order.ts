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
    enum: ['pending', 'accepted', 'completed'], 
    default: 'pending'
  }
}, {
  timestamps: true 
});

const Order = model('Order', orderSchema);

export default Order;
