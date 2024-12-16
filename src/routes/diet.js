"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const diet_controller_1 = __importDefault(require("../controllers/diet.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/create", diet_controller_1.default.createDiet);
router.post("/assing", diet_controller_1.default.assignDietToClient);
router.get("/", diet_controller_1.default.getAllDiets);
router.post("/assingByEmail", diet_controller_1.default.assignDietByEmail);
router.get("/getDietByNutri/:id", diet_controller_1.default.getDietsByNutritionist);
router.get("/getDietByClient/:id", diet_controller_1.default.getDietsByClient);
