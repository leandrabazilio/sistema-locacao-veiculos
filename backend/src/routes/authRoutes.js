import express from "express";
import { login, perfil } from "../controllers/authController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/perfil", autenticarToken, perfil);

export default router;
