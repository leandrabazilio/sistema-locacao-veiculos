import express from "express";
import prisma from "./config/prisma.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { autenticarToken } from "./middlewares/authMiddleware.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";
import locacaoRoutes from "./routes/locacaoRoutes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);

app.use("/auth", authRoutes);

app.use("/veiculos", veiculoRoutes);

app.use("/locacoes", locacaoRoutes);

app.get("/teste-autenticacao", autenticarToken, (req, res) => {
  res.json({
    mensagem: "Acesso autorizado!",
    usuario: req.usuario
  });
});

const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    mensagem: "Sistema de Locação de Veículos funcionando!",
  });
});

app.get("/teste-banco", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      mensagem: "Conexão com o banco de dados realizada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);

    res.status(500).json({
      mensagem: "Erro ao conectar ao banco de dados.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});