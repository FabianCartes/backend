import { getRepository } from 'typeorm';
import  Task  from '../entity/task.js';
import  User  from '../entity/users.js';

// Obtener todas las tareas
const getALLtasks = async (req, res, next) => {
  try {
    const taskRepository = getRepository(Task);
    
    if (req.user.role === 'moderador') {
      const allTasks = await taskRepository.find();
      return res.json(allTasks);
    }
    
    const allTasks = await taskRepository.find({ where: { user: { id: req.user.id } } });
    return res.json(allTasks);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los usuarios con sus tareas
const getUsersWithTasks = async (req, res, next) => {
  try {
    if (req.user.role !== 'moderador') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de moderador.' });
    }

    const userRepository = getRepository(User);
    
    const users = await userRepository.createQueryBuilder('u')
      .leftJoinAndSelect('u.tasks', 't')
      .select(['u.id', 'u.username', 'u.email', 'u.role', 't.id', 't.title', 't.description', 't.completed'])
      .getMany();
    
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Obtener una tarea específica
const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskRepository = getRepository(Task);

    const task = await taskRepository.findOne({ where: { id, user: { id: req.user.id } } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or does not belong to the user' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva tarea
const createTask = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const taskRepository = getRepository(Task);
    
    const task = taskRepository.create({
      title,
      description,
      user: { id: req.user.id }, // Relacionando la tarea con el usuario
    });

    await taskRepository.save(task);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Eliminar una tarea
const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const taskRepository = getRepository(Task);

    const result = await taskRepository.delete({ id, user: { id: req.user.id } });

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Task not found or does not belong to the user' });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// Actualizar una tarea
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const taskRepository = getRepository(Task);

    const task = await taskRepository.findOne({ where: { id, user: { id: req.user.id } } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or does not belong to the user' });
    }

    task.title = title;
    task.description = description;

    await taskRepository.save(task);

    return res.json(task);
  } catch (error) {
    next(error);
  }
};

export default {
  getALLtasks,
  getUsersWithTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};
