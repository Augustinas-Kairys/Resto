import { Router } from 'express';

import { 
  createTable, getTables, getTableById, updateTable, deleteTable 
} from '../controllers/tableController';



const router = Router();



// Table routes
router.post('/tables', createTable);
router.get('/tables', getTables);
router.get('/tables/:id', getTableById);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);



export default router;