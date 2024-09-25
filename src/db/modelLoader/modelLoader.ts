//Aqui se carga el modelo en la bd
import Users from "../models/user.model";

async function loadModels() {
  try {
    await Users.sync();
    console.log("La tabla User creada correctamente.");
  } catch (error) {
    console.error("Error al crear la tabla User:", error);
  }
}

export { loadModels };
