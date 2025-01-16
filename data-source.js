import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// Carga las variables de entorno del archivo .env
dotenv.config();

// Configura la conexión
const AppDataSource = new DataSource({
  type: "postgres", // El tipo de base de datos (postgres, mysql, etc.)
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Cambiar a "false" en producción
  logging: false,
  entities: ["src/entity/**/*.js"], // Ajusta la ruta según tu estructura
  migrations: ["src/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.js"],
});

export default AppDataSource;