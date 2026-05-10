import express from 'express';
import { 
  createClient, 
  listClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} from '../controllers/clientController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // All client routes require auth

router.route('/')
  .post(createClient)
  .get(listClients);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

export default router;
