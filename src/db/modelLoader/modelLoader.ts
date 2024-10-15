//Aqui se carga el modelo en la bd
import Users from "../../models/user.model";
import Client from "../../models/client.models";
import Coach from "../../models/coach.models";
import Routines from "../../models/routines.models";

async function loadModels() {
  try {
    /***
     await Users.sync();
    console.log("La tabla User creada correctamente.");

    await Coach.sync();
    console.log("La tabla Coach creada correctamente.");

    await Client.sync();
    console.log("La tabla Client creada correctamente.");

    await Routines.sync();
    console.log("La tabla Routines creada correctamente.");
     */


    //Declarar y cargar las asociaciones
    /* Coach.hasMany(Client, { foreignKey: "coachId", as: "clients" });
    Client.belongsTo(Coach, { foreignKey: "coachId", as: "coach" });
    Client.belongsTo(Users, { foreignKey: "userId", as: "user" });
    Users.hasOne(Client, { foreignKey: "userId", as: "client" });
    Coach.hasMany(Routines, { foreignKey: "coachId", as: "routines" });
    Client.hasMany(Routines, { foreignKey: "clientId", as: "routines" });
    Routines.belongsTo(Coach, { foreignKey: "coachId", as: "coach" });
    Routines.belongsTo(Client, { foreignKey: "clientId", as: "client" }); */
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
