import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();

router.post("/signup",authController.authRegistar);
router.post("/login",authController.authLogin)

export const authRouter = router;