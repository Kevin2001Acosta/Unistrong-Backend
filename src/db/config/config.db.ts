import { Sequelize } from "sequelize";
import config from "../config/config.env";

const sequelize = new Sequelize(
  `postgres://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

export { sequelize, testConnection };
