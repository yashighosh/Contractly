import express from 'express';
import { viewContract, signContract } from '../controllers/signatureController';

const router = express.Router();

router.get('/:id', viewContract);
router.post('/:id', signContract);

export default router;
