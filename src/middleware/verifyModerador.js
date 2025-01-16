import { getRepository } from 'typeorm';
import  User  from '../entity/users.js';
import  authenticate  from '../middleware/authenticateToken.js';
const authenticateToken = authenticate; 

// Middleware para verificar roles
const verifyRole = (roles) => async (req, res, next) => {
  try {
    // Verificar si el token contiene un usuario
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el rol del usuario está permitido
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next(); // El rol es válido, continuamos con la siguiente operación
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el rol', details: error.message });
  }
};

export default { authenticateToken, verifyRole };

