"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const coach_controller_1 = __importDefault(require("../controllers/coach.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/register", coach_controller_1.default.createCoach);
router.get("/", coach_controller_1.default.getAllCoaches);
router.get("/:id", coach_controller_1.default.getCoachById);
router.get("/:id/clients", coach_controller_1.default.getClientsByCoachId);
