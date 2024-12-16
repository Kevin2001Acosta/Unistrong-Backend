"use strict";
// 
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
const routines_services_1 = __importDefault(require("../services/routines/routines.services"));
const http_errors_1 = __importDefault(require("http-errors"));
class RoutineController {
    // Crear una rutina y asignarla a un cliente
    createRoutine(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const routine = yield routines_services_1.default.createRoutine(req.body);
                res.status(201).json(routine);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    // Obtener todas las rutinas
    getAllRoutines(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const routines = yield routines_services_1.default.getAllRoutines();
                res.status(200).json(routines);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    // Asignar una rutina existente a un cliente existente en la tabla cliente
    assignRoutineToClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId, routineId, scheduledDate } = req.body;
                // Validar los IDs
                if (!clientId || isNaN(clientId)) {
                    throw new Error("ID de cliente inválido");
                }
                if (!routineId || isNaN(routineId)) {
                    throw new Error("ID de rutina inválido");
                }
                if (!scheduledDate) {
                    throw new Error("Fecha programada inválida");
                }
                // Asignar la rutina al cliente con la fecha programada
                yield routines_services_1.default.assignRoutineToClient({
                    clientId,
                    routineId,
                    scheduledDate,
                });
                res.status(200).json({ message: "Rutina asignada correctamente" });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    //Anterior
    // async assignRoutineByEmail(
    //   req: Request,
    //   res: Response,
    //   next: NextFunction
    // ): Promise<void> {
    //   const { email, routineId, scheduledDate, recurrenceDay } = req.body;
    //   try {
    //     // Validar campos obligatorios
    //     if (
    //       !email ||
    //       !routineId ||
    //       !scheduledDate ||
    //       recurrenceDay === undefined
    //     ) {
    //       return next(
    //         createError(
    //           400,
    //           "Los campos obligatorios son: email, routineId, scheduledDate y recurrenceDay."
    //         )
    //       );
    //     }
    //     // Validar que `recurrenceDay` sea un valor válido (0-6)
    //     if (recurrenceDay < 0 || recurrenceDay > 6) {
    //       return next(
    //         createError(400, "El día de recurrencia debe estar entre 0 y 6.")
    //       );
    //     }
    //     // Conversión de `scheduledDate` a un objeto de tipo `Date`
    //     const parsedScheduledDate = new Date(scheduledDate);
    //     if (isNaN(parsedScheduledDate.getTime())) {
    //       return next(createError(400, "La fecha proporcionada no es válida."));
    //     }
    //     // Llamar al servicio para asignar la rutina
    //     const { recurrentDates } = await RoutineService.assignRoutineByEmail(
    //       email,
    //       routineId,
    //       parsedScheduledDate,
    //       recurrenceDay
    //     );
    //     res.status(200).json({
    //       message: "Rutina asignada correctamente.",
    //       recurrentDates,
    //     });
    //   } catch (error) {
    //     next(createError(400, (error as Error).message));
    //   }
    // }
    assignRoutineByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, routineId, scheduledDate, recurrenceDay } = req.body;
            try {
                // Validar campos obligatorios
                if (!email ||
                    !routineId ||
                    !scheduledDate ||
                    recurrenceDay === undefined) {
                    return next((0, http_errors_1.default)(400, "Los campos obligatorios son: email, routineId, scheduledDate y recurrenceDay."));
                }
                // Validar que `recurrenceDay` sea un valor válido (0-6)
                if (recurrenceDay < 0 || recurrenceDay > 6) {
                    return next((0, http_errors_1.default)(400, "El día de recurrencia debe estar entre 0 y 6."));
                }
                // Conversión de `scheduledDate` a un objeto de tipo `Date`
                const parsedScheduledDate = new Date(scheduledDate);
                if (isNaN(parsedScheduledDate.getTime())) {
                    return next((0, http_errors_1.default)(400, "La fecha proporcionada no es válida."));
                }
                // Llamar al servicio para asignar la rutina
                const { recurrentDates } = yield routines_services_1.default.assignRoutineByEmail(email, routineId, parsedScheduledDate, recurrenceDay);
                res.status(200).json({
                    message: "Rutina asignada correctamente.",
                    recurrentDates,
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                next((0, http_errors_1.default)(500, errorMessage));
            }
        });
    }
    //actual
    // async getClientRoutines(req: Request, res: Response, next: NextFunction) {
    //   const { clientId } = req.params;
    //   try {
    //     // Validar que el clientId sea un número válido
    //     if (!clientId || isNaN(Number(clientId))) {
    //       return next(
    //         createError(400, "El ID del cliente debe ser un número válido.")
    //       );
    //     }
    //     // Llamar al servicio para obtener las rutinas del cliente
    //     const routines = await RoutineService.getRoutinesByClientId(
    //       Number(clientId)
    //     );
    //     // Responder con las rutinas obtenidas
    //     return res.status(200).json(routines);
    //   } catch (error) {
    //     // Manejo de errores centralizado
    //     next(
    //       createError(
    //         500,
    //         `Error al obtener las rutinas del cliente: ${
    //           (error as Error).message
    //         }`
    //       )
    //     );
    //   }
    // }
    getClientRoutines(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId } = req.params;
            try {
                // Validar que el clientId sea un número válido
                if (!clientId || isNaN(Number(clientId))) {
                    return next((0, http_errors_1.default)(400, "El ID del cliente debe ser un número válido."));
                }
                // Llamar al servicio para obtener las rutinas del cliente
                const routines = yield routines_services_1.default.getRoutinesByClientId(Number(clientId));
                // Si no se encontraron rutinas, responder con un mensaje adecuado
                if (!routines || (Array.isArray(routines) && routines.length === 0)) {
                    return res.status(404).json({
                        message: "Este cliente no tiene rutinas asignadas.",
                    });
                }
                // Responder con las rutinas obtenidas
                return res.status(200).json(routines);
            }
            catch (error) {
                next((0, http_errors_1.default)(500, `Error al obtener las rutinas del cliente: ${error.message}`));
            }
        });
    }
    // async getCoachRoutines(req: Request, res: Response, next: NextFunction) {
    //   const { coachId } = req.params;
    //   try {
    //     const coach = await RoutineService.getRoutinesByCoachId(Number(coachId));
    //     if (!coach || !coach.routines || coach.routines.length === 0) {
    //       return res
    //         .status(404)
    //         .json({ message: "No se encontraron rutinas para este coach." });
    //     }
    //     return res.status(200).json(coach.routines);
    //   } catch (error) {
    //     next(
    //       createError(
    //         400,
    //         `Error al obtener rutinas: ${(error as Error).message}`
    //       )
    //     );
    //   }
    // }
    getCoachRoutines(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coachId } = req.params;
            try {
                const coach = yield routines_services_1.default.getRoutinesByCoachId(Number(coachId));
                if (!coach || !coach.routines || coach.routines.length === 0) {
                    return res
                        .status(404)
                        .json({ message: "No se encontraron rutinas para este coach." });
                }
                return res.status(200).json(coach.routines);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, `Error al obtener rutinas: ${error.message}`));
            }
        });
    }
}
exports.default = new RoutineController();
