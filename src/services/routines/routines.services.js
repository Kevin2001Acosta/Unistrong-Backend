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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routines_models_1 = __importDefault(require("../../db/models/routines.models"));
const client_models_1 = __importDefault(require("../../db/models/client.models"));
const coach_models_1 = __importDefault(require("../../db/models/coach.models"));
const client_routines_1 = __importDefault(require("../../db/models/client_routines"));
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const user_types_1 = require("../../db/models/utils/user.types");
const calculateRoutines_services_1 = require("./calculateRoutines.services");
const date_fns_1 = require("date-fns");
class RoutineService {
    createRoutine(routineData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coach = yield coach_models_1.default.findByPk(routineData.coachId);
                const id = coach === null || coach === void 0 ? void 0 : coach.id;
                if (!id) {
                    throw new Error("Coach no encontrado");
                }
                routineData.coachId = id;
                const routine = yield routines_models_1.default.create(routineData);
                return routine;
            }
            catch (error) {
                throw new Error(`Error al crear la rutina: ${error.message}`);
            }
        });
    }
    getAllRoutines() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const routines = yield routines_models_1.default.findAll();
                return routines.length > 0 ? routines : [];
            }
            catch (error) {
                throw new Error(`Error al obtener las rutinas: ${error.message}`);
            }
        });
    }
    // Asignar rutina a cliente
    assignRoutineToClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId, routineId } = data;
            try {
                // Verificar si el cliente y la rutina existen
                const clientExists = yield client_models_1.default.findByPk(clientId);
                if (!clientExists) {
                    throw new Error("El cliente especificado no existe.");
                }
                const routineExists = yield routines_models_1.default.findByPk(routineId);
                if (!routineExists) {
                    throw new Error("La rutina especificada no existe.");
                }
                // Asignar la rutina al cliente en la tabla intermedia
                yield client_routines_1.default.create({
                    clientId,
                    routineId,
                    scheduledDate: new Date(),
                });
            }
            catch (error) {
                throw new Error(`Error al asignar la rutina: ${error.message}`);
            }
        });
    }
    assignRoutineByEmail(email, routineId, scheduledDate, recurrenceDay) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar el usuario por email
                const user = yield user_model_1.default.findOne({ where: { email } });
                if (!user) {
                    throw new Error("Usuario no encontrado.");
                }
                if (user.userType !== user_types_1.UserType.CLIENT) {
                    throw new Error("El usuario especificado no es un cliente.");
                }
                // Buscar el cliente asociado al usuario
                const client = yield client_models_1.default.findOne({ where: { user_id: user.id } });
                if (!client) {
                    throw new Error("Cliente no encontrado.");
                }
                // Verificar si la rutina existe
                const routine = yield routines_models_1.default.findByPk(routineId);
                if (!routine) {
                    throw new Error("Rutina no encontrada.");
                }
                // Extraer la hora desde `scheduledDate` y asegurarse de que esté en la misma zona horaria
                const hours = scheduledDate.getHours();
                const minutes = scheduledDate.getMinutes();
                // Crear un objeto Date en la zona horaria correcta
                const correctedScheduledDate = (0, date_fns_1.setHours)((0, date_fns_1.setMinutes)(new Date(scheduledDate), minutes), hours);
                // Generar fechas recurrentes usando `calculateRecurrentDates`
                const recurrentDates = (0, calculateRoutines_services_1.calculateRecurrentDates)(recurrenceDay, (0, date_fns_1.format)(correctedScheduledDate, "HH:mm"), // Hora formateada
                correctedScheduledDate);
                // Crear asignación de la rutina, incluyendo las fechas recurrentes
                yield client_routines_1.default.create({
                    clientId: client.id,
                    routineId: routine.id,
                    scheduledDate: correctedScheduledDate,
                    recurrenceDay,
                    time: (0, date_fns_1.format)(correctedScheduledDate, "HH:mm"),
                    recurrentDates: recurrentDates, // Guardar las fechas recurrentes
                });
                // Asegurarse de que las fechas recurrentes estén correctamente formateadas
                const formattedRecurrentDates = recurrentDates.map((date) => (0, date_fns_1.format)(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));
                return { recurrentDates: formattedRecurrentDates };
            }
            catch (error) {
                throw new Error(`Error al asignar la rutina: ${error.message}`);
            }
        });
    }
    getRoutinesByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar el cliente y sus rutinas asociadas, incluyendo los datos de 'client_routines'
                const client = yield client_models_1.default.findByPk(clientId, {
                    include: [
                        {
                            model: routines_models_1.default,
                            as: "routines",
                            through: {
                                attributes: [
                                    "scheduledDate",
                                    "recurrenceDay",
                                    "time",
                                    "recurrentDates", // Traemos las fechas recurrentes almacenadas en la base de datos
                                ],
                            },
                        },
                    ],
                });
                // Si el cliente no existe, lanzar un error
                if (!client) {
                    throw new Error("Cliente no encontrado.");
                }
                // Si el cliente no tiene rutinas asignadas, devolver un mensaje apropiado
                if (!client.routines || client.routines.length === 0) {
                    return { message: "Este cliente no tiene rutinas asignadas." };
                }
                // Mapeamos las rutinas y sus datos, extrayendo 'recurrentDates' directamente de la base de datos
                const routinesWithClientDetails = client.routines.map((routine) => {
                    const _a = routine.toJSON(), { client_routines } = _a, routineData = __rest(_a, ["client_routines"]);
                    const { scheduledDate, recurrenceDay, time, recurrentDates } = client_routines || {};
                    return Object.assign(Object.assign({}, routineData), { scheduledDate: (0, date_fns_1.format)(new Date(scheduledDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"), recurrenceDay,
                        time,
                        recurrentDates });
                });
                return routinesWithClientDetails;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // async getRoutinesByCoachId(coachId: number) {
    //   try {
    //     const coach = await Coach.findByPk(coachId, {
    //       include: [
    //         {
    //           model: Routines,
    //           as: "routines",
    //           attributes: [
    //             "id",
    //             "name",
    //             "description",
    //             "category",
    //             "musclesWorked",
    //           ],
    //           include: [
    //             {
    //               model: Client,
    //               as: "clients",
    //               attributes: ["id", "user_id", "coach_id"],
    //               through: {
    //                 attributes: [
    //                   "scheduledDate",
    //                   "recurrenceDay",
    //                   "time",
    //                   "recurrentDates",
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     });
    //     if (!coach) {
    //       throw new Error("Coach no encontrado.");
    //     }
    //     return coach;
    //   } catch (error) {
    //     throw new Error(`Error al obtener rutinas: ${(error as Error).message}`);
    //   }
    // }
    getRoutinesByCoachId(coachId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coach = yield coach_models_1.default.findByPk(coachId, {
                    include: [
                        {
                            model: routines_models_1.default,
                            as: "routines",
                            attributes: [
                                "id",
                                "name",
                                "description",
                                "category",
                                "musclesWorked",
                            ],
                            include: [
                                {
                                    model: client_models_1.default,
                                    as: "clients",
                                    attributes: ["id", "user_id", "coach_id"],
                                    through: {
                                        attributes: [
                                            "scheduledDate",
                                            "recurrenceDay",
                                            "time",
                                            "recurrentDates",
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                });
                if (!coach) {
                    throw new Error("Coach no encontrado.");
                }
                return coach;
            }
            catch (error) {
                throw new Error(`Error al obtener rutinas: ${error.message}`);
            }
        });
    }
}
exports.default = new RoutineService();
