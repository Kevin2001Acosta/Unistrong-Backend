"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/", admin_controller_1.default.createAdmin);
router.post("/createAny", admin_controller_1.default.createUserAnyType);
router.post("/assignCoach", admin_controller_1.default.assignCoachToClient);
router.post("/assignNutri", admin_controller_1.default.assignNutriToClient);
router.get("/coachinfo", admin_controller_1.default.getCoachInfo);
router.get("/nutriinfo", admin_controller_1.default.getNutriInfo);
router.get("/clientinfo", admin_controller_1.default.getClientInfo);
router.post("/deactivateUsers", admin_controller_1.default.updateUsersState);
