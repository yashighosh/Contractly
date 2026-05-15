import express from 'express';
import { signup, login, refreshToken, me, logout } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/signup', validate(registerSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

export default router;
