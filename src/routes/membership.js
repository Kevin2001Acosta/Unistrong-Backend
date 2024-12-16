"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// src/routes/membership.routes.ts
const express_1 = require("express");
const membership_controller_1 = __importDefault(require("../controllers/membership.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
exports.router = router;
router.post("/register", auth_middleware_1.verifyToken, membership_controller_1.default.registerMembership);
// MembershipPayments
router.post("/remainingDays", membership_controller_1.default.getMembershipRemainingDays);
