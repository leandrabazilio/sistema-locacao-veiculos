import { autenticarUsuario } from "../services/authService.js";

export async function login(req, res) {
  const { email, senha } = req.body ?? {};

  const resultado = await autenticarUsuario(email, senha);

  return res.status(200).json({
    mensagem: "Login realizado com sucesso!",
    ...resultado
  });
}

export async function perfil(req, res) {
  return res.status(200).json({
    usuario: req.usuario
  });
}
