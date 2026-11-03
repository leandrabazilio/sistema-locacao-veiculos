import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
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

  const token = partes[1];

  try {
    const dadosUsuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = dadosUsuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado."
    });
  }
}