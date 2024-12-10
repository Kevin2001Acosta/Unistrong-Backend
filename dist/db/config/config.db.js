import { Sequelize } from "sequelize";
import config from "../config/config.env";
const dbName = config.dbName || "";
const dbUser = config.dbUser || "";
const dbHost = config.dbHost || "";
console.log("dbHost", dbHost);
const sequelize = new Sequelize(dbName, dbUser, config.dbPassword, {
    ssl: false,
    host: dbHost,
    port: Number(config.dbPort),
    dialect: "postgres",
    dialectOptions: {
        ssl: false,
    },
    logging: false,
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Conexión establecida correctamente.");
    }
    catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
    }
}
export { sequelize, testConnection };
