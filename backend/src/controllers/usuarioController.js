import { cadastrarUsuario } from "../services/usuarioService.js";

export async function criarUsuario(req, res) {
  try {
    const usuario = await cadastrarUsuario(req.body);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}