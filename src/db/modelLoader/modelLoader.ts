//Aqui se carga el modelo en la bd
import Users from "../../models/user.model";
import Client from "../../models/client.models";
import Coach from "../../models/coach.models";
import Routines from "../../models/routines.models";
import Verification from "../../models/verification.models";

async function loadModels() {
  try {

     await Users.sync({ alter: true });
    console.log("La tabla User creada correctamente.");

    await Coach.sync({ alter: true });
    console.log("La tabla Coach creada correctamente.");

    await Client.sync({ alter: true });
    console.log("La tabla Client creada correctamente.");

    await Routines.sync({ alter: true });
    console.log("La tabla Routines creada correctamente.");

    await Verification.sync({ alter: true });
    console.log("La tabla Verification creada correctamente.");


    //Declarar y cargar las asociaciones
    Coach.hasMany(Client, { foreignKey: "coachId", as: "clients" }); // Un coach tiene muchos clientes
    Client.belongsTo(Coach, { foreignKey: "coachId", as: "coach" }); // Un cliente pertenece a un coach
    Client.belongsTo(Users, { foreignKey: "userId", as: "user" }); // Un cliente pertenece a un usuario
    Users.hasOne(Client, { foreignKey: "userId", as: "client" }); // Un usuario tiene un cliente
    Coach.hasMany(Routines, { foreignKey: "coachId", as: "routines" }); // Un coach tiene muchas rutinas
    Client.hasMany(Routines, { foreignKey: "clientId", as: "routines" }); // Un cliente tiene muchas rutinas
    Routines.belongsTo(Coach, { foreignKey: "coachId", as: "coach" }); // Una rutina pertenece a un coach
    Routines.belongsTo(Client, { foreignKey: "clientId", as: "client" }); // Una rutina pertenece a un cliente
    Users.hasMany(Verification, { foreignKey: "userId", as: "verifications" }); // Un usuario tiene muchas verificaciones
    Verification.belongsTo(Users, { foreignKey: "userId", as: "user" }); // Una verificación pertenece a un usuario
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
