import express from 'express';
import { 
  createTemplate, 
  listTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate 
} from '../controllers/templateController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // All template routes require auth

router.route('/')
  .post(createTemplate)
  .get(listTemplates);

router.route('/:id')
  .get(getTemplateById)
  .put(updateTemplate)
  .delete(deleteTemplate);

export default router;
