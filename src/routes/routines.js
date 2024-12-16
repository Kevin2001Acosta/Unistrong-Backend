"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const routines_controller_1 = __importDefault(require("../controllers/routines.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/create", routines_controller_1.default.createRoutine);
router.post("/assing", routines_controller_1.default.assignRoutineToClient);
router.get("/", routines_controller_1.default.getAllRoutines);
router.post("/assignByEmail", routines_controller_1.default.assignRoutineByEmail);
router.get("/client/:clientId", routines_controller_1.default.getClientRoutines);
router.get("/coach/:coachId", routines_controller_1.default.getCoachRoutines);
