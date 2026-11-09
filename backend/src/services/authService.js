import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export async function autenticarUsuario(email, senha) {
  if (typeof email !== "string" || typeof senha !== "string" || !email || !senha) {
    throw new AppError("Informe e-mail e senha.");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() }
  });

  if (!usuario) {
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    },
    token
  };
}
