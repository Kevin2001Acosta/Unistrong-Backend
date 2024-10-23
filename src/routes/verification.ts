import { Router } from "express";
import { sendVerificationCode } from "../controllers/verification.controller";

const router = Router();

router.post("/send-code", sendVerificationCode);

export { router };