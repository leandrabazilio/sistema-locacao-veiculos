import express from "express";
import prisma from "./config/prisma.js";

const app = express();

app.use(express.json());

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
