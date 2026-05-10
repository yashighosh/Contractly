import express from 'express';
import { viewContract, signContract } from '../controllers/signatureController';

const router = express.Router();

router.get('/:token', viewContract);
router.post('/:token', signContract);

export default router;
