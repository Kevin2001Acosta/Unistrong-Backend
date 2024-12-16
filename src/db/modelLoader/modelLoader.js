"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModels = loadModels;
//Aqui se carga el modelo en la bd
const user_model_1 = __importDefault(require("../models/user.model"));
const client_models_1 = __importDefault(require("../models/client.models"));
const coach_models_1 = __importDefault(require("../models/coach.models"));
const routines_models_1 = __importDefault(require("../models/routines.models"));
const verification_models_1 = __importDefault(require("../models/verification.models"));
const client_routines_1 = __importDefault(require("../models/client_routines"));
const nutritionist_model_1 = __importDefault(require("../models/nutritionist.model"));
const classes_models_1 = __importDefault(require("../models/classes.models"));
const client_characteristics_models_1 = __importDefault(require("../models/client.characteristics.models"));
const acountant_models_1 = __importDefault(require("../models/acountant.models"));
const diets_models_1 = __importDefault(require("../models/diets.models"));
const client_diets_models_1 = __importDefault(require("../models/client_diets.models"));
const reservations_models_1 = __importDefault(require("../models/reservations.models"));
const membership_models_1 = __importDefault(require("../models/membership.models"));
const membership_payment_models_1 = __importDefault(require("../models/membership.payment.models"));
const admin_models_1 = __importDefault(require("../models/admin.models"));
function loadModels() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_model_1.default.sync({ alter: true });
            yield coach_models_1.default.sync({ alter: true });
            yield acountant_models_1.default.sync({ alter: true });
            yield nutritionist_model_1.default.sync({ alter: true });
            yield admin_models_1.default.sync({ alter: true });
            yield classes_models_1.default.sync({ alter: true });
            yield membership_models_1.default.sync({ alter: true });
            yield client_models_1.default.sync({ alter: true });
            yield reservations_models_1.default.sync({ alter: true });
            yield client_characteristics_models_1.default.sync({ alter: true });
            yield diets_models_1.default.sync({ alter: true });
            yield client_diets_models_1.default.sync({ alter: true });
            yield routines_models_1.default.sync({ alter: true });
            yield verification_models_1.default.sync({ alter: true });
            yield client_routines_1.default.sync({ alter: true });
            yield membership_payment_models_1.default.sync({ alter: true });
            //Declarar y cargar las asociaciones aqui
            // Relación Usuario-Cliente (uno a uno)
            user_model_1.default.hasOne(client_models_1.default, { foreignKey: "user_id", as: "client" });
            client_models_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
            // Relación Usuario-Admin (uno a uno)
            user_model_1.default.hasOne(admin_models_1.default, { foreignKey: "user_id", as: "admin" });
            admin_models_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
            // Relación Coach-Cliente (uno a muchos)
            coach_models_1.default.hasMany(client_models_1.default, { foreignKey: "coach_id", as: "clients" });
            client_models_1.default.belongsTo(coach_models_1.default, { foreignKey: "coach_id", as: "coach" });
            // Relación Coach-Classes (uno a muchos)
            coach_models_1.default.hasMany(classes_models_1.default, { foreignKey: "coachId", as: "classes" });
            classes_models_1.default.belongsTo(coach_models_1.default, { foreignKey: "coachId", as: "coach" });
            // Relación Usuario-Coach (uno a uno)
            user_model_1.default.hasOne(coach_models_1.default, { foreignKey: "user_id", as: "coach" });
            coach_models_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
            // Relación Usuario-Accountant (uno a uno)
            user_model_1.default.hasOne(acountant_models_1.default, { foreignKey: "user_id", as: "accountant" });
            acountant_models_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
            // Relación Usuario-Nutritionist (uno a uno)
            user_model_1.default.hasOne(nutritionist_model_1.default, { foreignKey: "user_id", as: "nutritionist" });
            nutritionist_model_1.default.belongsTo(user_model_1.default, { foreignKey: "user_id", as: "user" });
            user_model_1.default.hasMany(verification_models_1.default, { foreignKey: "userId", as: "verifications" }); // Un usuario tiene muchas verificaciones
            verification_models_1.default.belongsTo(user_model_1.default, { foreignKey: "userId", as: "user" }); // Una verificación pertenece a un usuario
            // Relación Cliente-Clases (muchos a muchos) através de la tabla Reservations
            client_models_1.default.belongsToMany(classes_models_1.default, {
                foreignKey: "clientId",
                through: reservations_models_1.default,
                as: "reservedClasses",
            });
            classes_models_1.default.belongsToMany(client_models_1.default, {
                foreignKey: "classId",
                through: reservations_models_1.default,
                as: "assistants",
            });
            client_models_1.default.hasMany(reservations_models_1.default, {
                foreignKey: "clientId",
                as: "reservations",
            });
            reservations_models_1.default.belongsTo(client_models_1.default, {
                foreignKey: "clientId",
                as: "assistants",
            });
            classes_models_1.default.hasMany(reservations_models_1.default, {
                foreignKey: "classId",
                as: "reservations",
            });
            reservations_models_1.default.belongsTo(classes_models_1.default, { foreignKey: "classId", as: "class" });
            // Relación Cliente-Características (uno a uno)
            client_models_1.default.hasOne(client_characteristics_models_1.default, {
                foreignKey: "clientId",
                as: "characteristics",
            });
            client_characteristics_models_1.default.belongsTo(client_models_1.default, {
                foreignKey: "clientId",
                as: "client",
            });
            coach_models_1.default.hasMany(routines_models_1.default, {
                foreignKey: "coachId",
                as: "routines",
            });
            routines_models_1.default.belongsTo(coach_models_1.default, {
                foreignKey: "coachId",
                as: "coach",
            });
            // Relación muchos a muchos entre Client y Routine a través de la tabla ClientRoutines
            client_models_1.default.belongsToMany(routines_models_1.default, {
                foreignKey: "clientId",
                through: client_routines_1.default,
                as: "routines",
            });
            routines_models_1.default.belongsToMany(client_models_1.default, {
                foreignKey: "routineId",
                through: client_routines_1.default,
                as: "clients",
            });
            diets_models_1.default.hasMany(client_diets_models_1.default, { foreignKey: "dietId", as: "clientDiets" });
            client_diets_models_1.default.belongsTo(diets_models_1.default, { foreignKey: "dietId", as: "diet" }); // Agregar alias 'diet'
            // Relación de ClientDiets con Client
            client_diets_models_1.default.belongsTo(client_models_1.default, { foreignKey: "clientId", as: "client" });
            nutritionist_model_1.default.hasMany(diets_models_1.default, { foreignKey: "nutritionistId", as: "diets" });
            diets_models_1.default.belongsTo(nutritionist_model_1.default, {
                foreignKey: "nutritionistId",
                as: "nutritionist",
            });
            client_models_1.default.belongsToMany(diets_models_1.default, {
                foreignKey: "clientId",
                through: client_diets_models_1.default,
                as: "diets",
            });
            diets_models_1.default.belongsToMany(client_models_1.default, {
                foreignKey: "dietId",
                through: client_diets_models_1.default,
                as: "clients",
            });
            // relación membresía-cliente
            client_models_1.default.hasMany(membership_payment_models_1.default, {
                foreignKey: "clientId",
                as: "membershipPayments",
            });
            membership_payment_models_1.default.belongsTo(client_models_1.default, {
                foreignKey: "clientId",
                as: "client",
            });
            // relación cliente-tipo de membresía
            client_models_1.default.belongsTo(membership_models_1.default, {
                foreignKey: "membershipId",
                as: "membership",
            });
            membership_models_1.default.hasMany(client_models_1.default, { foreignKey: "membershipId", as: "clients" });
        }
        catch (error) {
            console.error("Error al crear las tablas o asociaciones:", error);
        }
    });
}
