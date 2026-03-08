import express from 'express';
const router = express.Router();
import { registerUser, loginUser, refreshAccessToken } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);

export default router;
