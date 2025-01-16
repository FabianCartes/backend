import { Router } from 'express';
import  getUsers  from '../controllers/user.controller.js';
const getUsersWithTasks = getUsers;
import  authenticate  from '../middleware/authenticateToken.js';
const authenticateToken = authenticate; 
import  verifyR  from '../middleware/verifyModerador.js';
const verifyRole = verifyR;
const router = Router();

// Ruta para obtener todos los usuarios con sus tareas
router.get('/ALLTasks', authenticateToken, verifyRole, getUsersWithTasks);

export default router;    