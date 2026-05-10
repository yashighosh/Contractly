import express from 'express';
import { 
  createClause, 
  listClauses, 
  getClauseById, 
  updateClause, 
  deleteClause 
} from '../controllers/clauseController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createClause)
  .get(listClauses);

router.route('/:id')
  .get(getClauseById)
  .put(updateClause)
  .delete(deleteClause);

export default router;
