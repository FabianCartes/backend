import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import User from '../entity/users.js';

const JWT_SECRET = 'secreto_super_seguro';

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { username, password, email, role = 'user' } = req.body; // role con valor por defecto 'user'

  try {
    const userRepository = getRepository(User);
    
    // Verificar si el nombre de usuario ya existe
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar contraseña

    // Crear un nuevo usuario
    const user = userRepository.create({ 
      username, 
      password: hashedPassword, 
      email, 
      role 
    });

    // Guardar el usuario en la base de datos
    await userRepository.save(user);

    res.status(201).json({ 
      message: 'Usuario registrado',
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al registrar usuario', 
      details: error.message 
    });
  }
};

// Iniciar sesión de usuario
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userRepository = getRepository(User);
    
    // Consultar si el usuario existe en la base de datos
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña es correcta
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar el token JWT incluyendo el rol
    const token = jwt.sign({ 
      id: user.id, 
      username: user.username,
      role: user.role // Añadir el rol al token
    }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Enviar el token y el rol explícitamente en la respuesta
    res.json({ 
      message: 'Login exitoso', 
      token, 
      role: user.role // Devolver el rol al frontend
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al iniciar sesión', 
      details: error.message 
    });
  }
};

export default { registerUser, loginUser };