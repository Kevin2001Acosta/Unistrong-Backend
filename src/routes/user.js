"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//endpoints
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/login", auth_controller_1.default.login); //primero
// router.post("/login", loginBestWayController.login);//segundo mejor forma
router.post("/logout", auth_middleware_1.verifyToken, auth_controller_1.default.logout);
router.get("/verify", auth_middleware_1.verifyToken, auth_controller_1.default.verifyToken);
router.post("/register", user_controller_1.default.createUser);
router.get("/", user_controller_1.default.getAllUsers);
router.get("/:id", user_controller_1.default.getUserById);
router.post("/disable-account/:token", user_controller_1.default.disableAccount);
router.patch("/editar_perfil/:id", user_controller_1.default.updateUserProfile);
router.post("/editar_medidas/:id", user_controller_1.default.updateUserMeasurements);
