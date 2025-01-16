import pkg from 'jsonwebtoken';
const { verify } = pkg
const JWT_SECRET = 'secreto_super_seguro';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no presente o inválido' });
  }

  verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    
    req.user = user; // Almacena el usuario autenticado
    next();
  });
};


export default { authenticateToken };