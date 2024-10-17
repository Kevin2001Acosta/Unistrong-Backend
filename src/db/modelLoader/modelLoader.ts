//Aqui se carga el modelo en la bd
import Users from "../models/user.model";
import Client from "../models/client.models";
import Coach from "../models/coach.models";
import Routines from "../models/routines.models";
import ClientRoutines from "../models/client_routines";
import Nutritionist from "../models/nutritionist.model";
import Classes from "../models/classes.models";
import ClientCharacteristics from "../models/client.characteristics.models";
import Accountant from "../models/acountant.models";

async function loadModels() {
  try {
    await Users.sync({ alter: true });
    console.log("La tabla User creada correctamente.");

    await Coach.sync({ alter: true });
    console.log("La tabla Coach creada correctamente.");

    await Accountant.sync({ alter: true });
    console.log("La tabla Accountant creada correctamente.");

    await Nutritionist.sync({ alter: true });
    console.log("La tabla Nutritionist creada correctamente.");

    await Classes.sync({ alter: true });
    console.log("La tabla Classes creada correctamente.");

    await Client.sync({ alter: true });
    console.log("La tabla Client creada correctamente.");

    await ClientCharacteristics.sync({ alter: true });
    console.log("La tabla ClientCharacteristics creada correctamente.");

    await Routines.sync({ alter: true });
    console.log("La tabla Routines creada correctamente.");

    await ClientRoutines.sync({ alter: true });
    console.log("La tabla ClientRoutines creada correctamente.");

    //Declarar y cargar las asociaciones aqui
    // Relación Usuario-Cliente (uno a uno)
    Users.hasOne(Client, { foreignKey: "user_id", as: "client" });
    Client.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    // Relación Coach-Cliente (uno a muchos)
    Coach.hasMany(Client, { foreignKey: "coach_id", as: "clients" });
    Client.belongsTo(Coach, { foreignKey: "coach_id", as: "coach" });

    // Relación Coach-Classes (uno a muchos)
    Coach.hasMany(Classes, { foreignKey: "coachId", as: "classes" });
    Classes.belongsTo(Coach, { foreignKey: "coachId", as: "coach" });

    // Relación Usuario-Coach (uno a uno)
    Users.hasOne(Coach, { foreignKey: "user_id", as: "coach" });
    Coach.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    // Relación Usuario-Accountant (uno a uno)
    Users.hasOne(Accountant, { foreignKey: "user_id", as: "accountant" });
    Accountant.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    // Relación Usuario-Nutritionist (uno a uno)
    Users.hasOne(Nutritionist, { foreignKey: "user_id", as: "nutritionist" });
    Nutritionist.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    // Relación Cliente-Características (uno a uno)
    Client.hasOne(ClientCharacteristics, {
      foreignKey: "clientId",
      as: "characteristics",
    });
    ClientCharacteristics.belongsTo(Client, {
      foreignKey: "clientId",
      as: "client",
    });

    // Relación muchos a muchos entre Client y Routine a través de la tabla ClientRoutines
    Client.belongsToMany(Routines, {
      foreignKey: "clientId",
      through: ClientRoutines,
      as: "routines",
    });
    Routines.belongsToMany(Client, {
      foreignKey: "routineId",
      through: ClientRoutines,
      as: "clients",
    });
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
