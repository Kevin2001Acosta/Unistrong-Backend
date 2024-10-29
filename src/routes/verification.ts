import { Router } from "express";
import { changePassword, sendVerificationCode, verifyCode } from "../controllers/verification.controller";

const router = Router();

router.post("/send-code", sendVerificationCode);
router.put("/verify-code", verifyCode);
router.put("/change-password", changePassword);

export { router };