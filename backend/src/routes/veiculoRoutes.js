import express from "express";
import {
  criarVeiculo,
  buscarVeiculos,
  buscarVeiculosDisponiveis
} from "../controllers/veiculoController.js";

import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", autenticarToken, criarVeiculo);
router.get("/", autenticarToken, buscarVeiculos);
router.get("/disponiveis", autenticarToken, buscarVeiculosDisponiveis);

export default router;