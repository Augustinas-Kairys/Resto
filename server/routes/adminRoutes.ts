import { Router } from 'express';
import { 
  createMenuItem, updateMenuItem, getMenuItems, getMenuItemById, deleteMenuItem 
} from '../controllers/menuController';
import { 
  createTable, getTables, getTableById, updateTable, deleteTable 
} from '../controllers/tableController';
import { 
  createOrder, getOrders, getOrderById, updateOrder, deleteOrder 
} from '../controllers/orderContoller';

const router = Router();

// Menu Item routes
router.post('/menu', createMenuItem);
router.get('/menu', getMenuItems);
router.get('/menu/:id', getMenuItemById);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Table routes
router.post('/tables', createTable);
router.get('/tables', getTables);
router.get('/tables/:id', getTableById);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);

// Order routes
router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

export default router;