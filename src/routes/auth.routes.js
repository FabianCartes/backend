import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
const {registerUser, loginUser} = authController;

const router = Router();

// Registro de usuarios
router.post('/register', registerUser);

// Login de usuarios
router.post('/login', loginUser);

export default router;