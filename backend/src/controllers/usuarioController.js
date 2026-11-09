import { cadastrarUsuario } from "../services/usuarioService.js";

export async function criarUsuario(req, res) {
  const usuario = await cadastrarUsuario(req.body ?? {});

  return res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso!",
    usuario
  });
}
