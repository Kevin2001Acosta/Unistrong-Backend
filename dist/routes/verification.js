import { Router } from "express";
import { changePassword, sendVerificationCode, verifyCode, sendVerificationEmail, verifyEmail } from "../controllers/verification.controller";
const router = Router();
router.post("/send-code", sendVerificationCode);
router.put("/verify-code", verifyCode);
router.put("/change-password", changePassword);
router.post("/send-email", sendVerificationEmail);
router.post("/verify-email", verifyEmail);
export { router };
