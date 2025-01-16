import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import AppDataSource from '../data-source.js';
import taskRoutes from './routes/tasks.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message,
  });
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');
    app.listen(4000, () => {
      console.log('Servidor en ejecución en el puerto 4000');
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
  }
})();