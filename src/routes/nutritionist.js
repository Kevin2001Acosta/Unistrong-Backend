"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const nutritionist_controller_1 = __importDefault(require("../controllers/nutritionist.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/register", nutritionist_controller_1.default.createNutritionist);
router.get("/", nutritionist_controller_1.default.getAllNutritionist);
