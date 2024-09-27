//Aqui se carga el modelo en la bd
import Users from "../models/user.model";
import Client from "../models/client.models";
import Coach from "../models/coach.models";

async function loadModels() {
  try {
    await Users.sync();
    console.log("La tabla User creada correctamente.");

    await Coach.sync();
    console.log("La tabla Coach creada correctamente.");

    await Client.sync();
    console.log("La tabla Client creada correctamente.");

    //Cargar las asociaciones
    Coach.hasMany(Client, { foreignKey: "coachId", as: "clients" });
    Client.belongsTo(Coach, { foreignKey: "coachId", as: "coach" });
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
