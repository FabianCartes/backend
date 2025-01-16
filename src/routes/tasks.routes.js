import { Router } from 'express';
import  authenticateToken  from '../middleware/authenticateToken.js';
import tasksController from '../controllers/tasks.controller.js';
const { getALLtasks, getTask, createTask, deleteTask, updateTask, getUsersWithTasks } = tasksController;

const router = Router();
//optener o listar
router.get('/tasks',authenticateToken, getALLtasks);
//retornando 1 sola tarea
router.get("/tasks/:id", authenticateToken, getTask);
//crear dato
router.post('/tasks', authenticateToken, createTask);
//eliminar
router.delete('/tasks/:id', authenticateToken, deleteTask);
//actualizar
router.put('/tasks/:id', authenticateToken, updateTask);
//retorna todas las tareas de los usuarios
router.put('/users-with-tasks', authenticateToken, getUsersWithTasks);

export default router;