import { Router } from "express";
import { sendVerificationCode, verifyCode } from "../controllers/verification.controller";

const router = Router();

router.post("/send-code", sendVerificationCode);
router.put("/verify-code", verifyCode);

export { router };