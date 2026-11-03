import express from "express";
import {
  criar,
  buscarTodas,
  finalizar
} from "../controllers/locacaoController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", autenticarToken, criar);
router.get("/", autenticarToken, buscarTodas);
router.patch("/:id/finalizar", autenticarToken, finalizar);

export default router;