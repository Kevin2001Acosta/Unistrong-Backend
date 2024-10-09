//Aqui se carga el modelo en la bd
import Users from "../models/user.model";
import Client from "../models/client.models";
import Coach from "../models/coach.models";
import Routines from "../models/routines.models";

async function loadModels() {
  try {
    await Users.sync({ alter: true });
    console.log("La tabla User creada correctamente.");

    await Coach.sync({ alter: true });
    console.log("La tabla Coach creada correctamente.");

    await Client.sync({ alter: true });
    console.log("La tabla Client creada correctamente.");

    //Declarar y cargar las asociaciones aqui
    // Relación Usuario-Cliente (uno a uno)
    Users.hasOne(Client, { foreignKey: "user_id", as: "client" });
    Client.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    // Relación Coach-Cliente (uno a muchos)
    Coach.hasMany(Client, { foreignKey: "coach_id", as: "clients" });
    Client.belongsTo(Coach, { foreignKey: "coach_id", as: "coach" });

    // Relación Usuario-Coach (uno a uno)
    Users.hasOne(Coach, { foreignKey: "user_id", as: "coach" });
    Coach.belongsTo(Users, { foreignKey: "user_id", as: "user" });
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
