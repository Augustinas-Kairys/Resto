import { Router } from 'express';

import { 
    createMenuItem, updateMenuItem, getMenuItems, getMenuItemById, deleteMenuItem 
} from '../controllers/menuController';

const router = Router();

// Menu Item routes
router.post('/menu', createMenuItem);
router.get('/menu', getMenuItems);
router.get('/menu/:id', getMenuItemById);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);


export default router;