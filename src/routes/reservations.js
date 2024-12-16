"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const reservations_controller_1 = __importDefault(require("../controllers/reservations.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/create", reservations_controller_1.default.createReservation);
router.get("/", reservations_controller_1.default.getAllReservations);
