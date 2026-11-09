import jwt from "jsonwebtoken";
import { buscarUsuarioPorId } from "../services/usuarioService.js";

export async function autenticarToken(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho) {
    return res.status(401).json({
      mensagem: "Token de autenticação não informado."
    });
  }

  const partes = cabecalho.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({
      mensagem: "Formato do token inválido."
    });
  }

  let dadosToken;

  try {
    dadosToken = jwt.verify(partes[1], process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado."
    });
  }

  const usuario = await buscarUsuarioPorId(dadosToken.id);

  if (!usuario) {
    return res.status(401).json({
      mensagem: "O usuário deste token não existe mais."
    });
  }

  req.usuario = usuario;

  next();
}
