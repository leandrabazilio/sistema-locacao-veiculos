import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function cadastrarUsuario(dados) {
  const { nome, email, senha } = dados;

  if (typeof nome !== "string" || typeof email !== "string" || typeof senha !== "string") {
    throw new AppError("Informe nome, e-mail e senha.");
  }

  const nomeFormatado = nome.trim();
  const emailFormatado = email.trim().toLowerCase();

  if (!nomeFormatado || nomeFormatado.length > 100) {
    throw new AppError("Informe um nome válido com até 100 caracteres.");
  }

  if (!REGEX_EMAIL.test(emailFormatado) || emailFormatado.length > 150) {
    throw new AppError("Informe um e-mail válido.");
  }

  if (senha.length < 6) {
    throw new AppError("A senha deve ter no mínimo 6 caracteres.");
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: emailFormatado }
  });

  if (usuarioExistente) {
    throw new AppError("Este e-mail já está cadastrado.", 409);
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  return await prisma.usuario.create({
    data: {
      nome: nomeFormatado,
      email: emailFormatado,
      senha: senhaHash
    },
    select: {
      id: true,
      nome: true,
      email: true,
      createdAt: true
    }
  });
}

export async function buscarUsuarioPorId(id) {
  return await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      nome: true,
      email: true
    }
  });
}
