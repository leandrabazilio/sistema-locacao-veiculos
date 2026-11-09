import "dotenv/config";
import express from "express";
import prisma from "./config/prisma.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";
import locacaoRoutes from "./routes/locacaoRoutes.js";
import { permitirFrontend } from "./middlewares/corsMiddleware.js";
import { rotaNaoEncontrada, tratarErros } from "./middlewares/errorMiddleware.js";

if (!process.env.JWT_SECRET) {
  console.error("A variável JWT_SECRET não foi definida no arquivo .env.");
  process.exit(1);
}

const app = express();

const PORT = process.env.PORT || 3000;

app.use(permitirFrontend);
app.use(express.json());

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

app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/locacoes", locacaoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
