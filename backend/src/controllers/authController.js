import { autenticarUsuario } from "../services/authService.js";

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const resultado = await autenticarUsuario(email, senha);

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      ...resultado
    });
  } catch (error) {
    return res.status(401).json({
      mensagem: error.message
    });
  }
}