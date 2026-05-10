import express from 'express';
import { 
  createContract, 
  listContracts, 
  getContractById, 
  updateContract, 
  deleteContract, 
  sendContract, 
  duplicateContract 
} from '../controllers/contractController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // All contract routes require auth

router.route('/')
  .post(createContract)
  .get(listContracts);

router.route('/:id')
  .get(getContractById)
  .put(updateContract)
  .delete(deleteContract);

router.post('/:id/send', sendContract);
router.post('/:id/duplicate', duplicateContract);

export default router;
