//Aqui se carga el modelo en la bd
import Users from "../models/user.model";
import Client from "../models/client.models";
import Coach from "../models/coach.models";
import Routines from "../models/routines.models";
import Verification from "../models/verification.models";
import ClientRoutines from "../models/client_routines";
import Nutritionist from "../models/nutritionist.model";
import Classes from "../models/classes.models";
import ClientCharacteristics from "../models/client.characteristics.models";
import Accountant from "../models/acountant.models";
import Diets from "../models/diets.models";
import ClientDiets from "../models/client_diets.models";
import Reservations from "../models/reservations.models";
import Membership from "../models/membership.models";
import MembershipPayment from "../models/membership.payment.models";
import Admin from "../models/admin.models";

async function loadModels() {
  try {
    await Users.sync({ alter: true });

    await Coach.sync({ alter: true });

    await Accountant.sync({ alter: true });

    await Nutritionist.sync({ alter: true });

    await Admin.sync({ alter: true });

    await Classes.sync({ alter: true });

    await Membership.sync({ alter: true });

    await Client.sync({ alter: true });

    await Reservations.sync({ alter: true });

    await ClientCharacteristics.sync({ alter: true });
    await Diets.sync({ alter: true });

    await ClientDiets.sync({ alter: true });

    await Routines.sync({ alter: true });

    await Verification.sync({ alter: true });

    await ClientRoutines.sync({ alter: true });

    await MembershipPayment.sync({ alter: true });

    //Declarar y cargar las asociaciones aqui
    // Relación Usuario-Cliente (uno a uno)
    Users.hasOne(Client, { foreignKey: "user_id", as: "client" });
    Client.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    // Relación Usuario-Admin (uno a uno)
    Users.hasOne(Admin, { foreignKey: "user_id", as: "admin" });
    Admin.belongsTo(Users, { foreignKey: "user_id", as: "user" });

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

    Users.hasMany(Verification, { foreignKey: "userId", as: "verifications" }); // Un usuario tiene muchas verificaciones
    Verification.belongsTo(Users, { foreignKey: "userId", as: "user" }); // Una verificación pertenece a un usuario

    // Relación Cliente-Clases (muchos a muchos) através de la tabla Reservations
    Client.belongsToMany(Classes, {
      foreignKey: "clientId",
      through: Reservations,
      as: "reservedClasses",
    });
    Classes.belongsToMany(Client, {
      foreignKey: "classId",
      through: Reservations,
      as: "assistants",
    });

    Client.hasMany(Reservations, {
      foreignKey: "clientId",
      as: "reservations",
    });
    Reservations.belongsTo(Client, {
      foreignKey: "clientId",
      as: "assistants",
    });

    Classes.hasMany(Reservations, {
      foreignKey: "classId",
      as: "reservations",
    });

    Reservations.belongsTo(Classes, { foreignKey: "classId", as: "class" });

    // Relación Cliente-Características (uno a uno)
    Client.hasOne(ClientCharacteristics, {
      foreignKey: "clientId",
      as: "characteristics",
    });
    ClientCharacteristics.belongsTo(Client, {
      foreignKey: "clientId",
      as: "client",
    });

    Coach.hasMany(Routines, {
      foreignKey: "coachId",
      as: "routines",
    });

    Routines.belongsTo(Coach, {
      foreignKey: "coachId",
      as: "coach",
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
    Diets.hasMany(ClientDiets, { foreignKey: "dietId", as: "clientDiets" });

    ClientDiets.belongsTo(Diets, { foreignKey: "dietId", as: "diet" }); // Agregar alias 'diet'

    // Relación de ClientDiets con Client
    ClientDiets.belongsTo(Client, { foreignKey: "clientId", as: "client" });

    Nutritionist.hasMany(Diets, { foreignKey: "nutritionistId", as: "diets" });
    Diets.belongsTo(Nutritionist, {
      foreignKey: "nutritionistId",
      as: "nutritionist",
    });

    Client.belongsToMany(Diets, {
      foreignKey: "clientId",
      through: ClientDiets,
      as: "diets",
    });
    Diets.belongsToMany(Client, {
      foreignKey: "dietId",
      through: ClientDiets,
      as: "clients",
    });
    // relación membresía-cliente
    Client.hasMany(MembershipPayment, {
      foreignKey: "clientId",
      as: "membershipPayments",
    });
    MembershipPayment.belongsTo(Client, {
      foreignKey: "clientId",
      as: "client",
    });

    // relación cliente-tipo de membresía
    Client.belongsTo(Membership, {
      foreignKey: "membershipId",
      as: "membership",
    });
    Membership.hasMany(Client, { foreignKey: "membershipId", as: "clients" });
  } catch (error) {
    console.error("Error al crear las tablas o asociaciones:", error);
  }
}

export { loadModels };
