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
import { validate } from '../middlewares/validate';
import { createContractSchema, updateContractSchema } from '../schemas/contractSchema';

const router = express.Router();

router.use(protect); // All contract routes require auth

router.post('/', validate(createContractSchema), createContract);
router.get('/', listContracts);

router.get('/:id', getContractById);
router.put('/:id', validate(updateContractSchema), updateContract);
router.delete('/:id', deleteContract);

router.post('/:id/send', sendContract);
router.post('/:id/duplicate', duplicateContract);

export default router;
