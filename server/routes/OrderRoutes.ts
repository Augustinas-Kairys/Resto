import { Router } from 'express';

import { 
    createOrder, getOrders, getOrderById, updateOrder, deleteOrder 
  } from '../controllers/orderContoller';
  
const router = Router();

// Order routes
router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);


export default router;