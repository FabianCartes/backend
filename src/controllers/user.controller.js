import { getRepository } from 'typeorm';
import  User  from '../entity/users.js';
import  Task  from '../entity/task.js';

const getUsersWithTasks = async (req, res) => {
  try {
    const userRepository = getRepository(User);
    
    // Obtener los usuarios con sus tareas utilizando join
    const users = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task') // 'tasks' es la relación en la entidad User
      .select([
        'user.id AS user_id',
        'user.username',
        'user.email',
        'user.role',
        'task.id AS task_id',
        'task.title',
        'task.description',
        'task.completed'
      ])
      .orderBy('user.username')
      .getRawMany(); // getRawMany nos da los resultados como un array de objetos

    // Organizar las tareas en un formato JSON agrupado por usuario
    const usersWithTasks = users.reduce((acc, user) => {
      const { user_id, username, email, role, task_id, title, description, completed } = user;
      
      let existingUser = acc.find(u => u.user_id === user_id);
      
      if (!existingUser) {
        existingUser = {
          user_id,
          username,
          email,
          role,
          tasks: []
        };
        acc.push(existingUser);
      }

      if (task_id) {
        existingUser.tasks.push({
          id: task_id,
          title,
          description,
          completed
        });
      }

      return acc;
    }, []);

    res.json(usersWithTasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios y tareas', details: error.message });
  }
};

export default { getUsersWithTasks };