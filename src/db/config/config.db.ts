//Aqui se configura la bd
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:12345678@localhost:5432/unistrong"
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
