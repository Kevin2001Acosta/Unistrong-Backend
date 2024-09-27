//Aqui se carga el modelo en la bd
import Users from "../models/user.model";
import Client from "../models/client.models";

async function loadModels() {
  try {
    //sincronizar modelos
    await Users.sync();
    console.log("La tabla User creada correctamente.");
    await Client.sync();
    console.log("La tabla Client creada correctamente.");
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
