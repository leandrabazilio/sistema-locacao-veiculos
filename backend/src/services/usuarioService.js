import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export async function cadastrarUsuario(dados) {
  const { nome, email, senha } = dados;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (usuarioExistente) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash
    },
    select: {
      id: true,
      nome: true,
      email: true,
      createdAt: true
    }
  });

  return usuario;
}