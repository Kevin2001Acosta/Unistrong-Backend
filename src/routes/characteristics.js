"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const characteristics_controller_1 = __importDefault(require("../controllers/characteristics.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/", characteristics_controller_1.default.createCharacteristics);
router.get("/", characteristics_controller_1.default.getAllCharacteristics);
router.get("/:id", characteristics_controller_1.default.getCharacteristicsById);
