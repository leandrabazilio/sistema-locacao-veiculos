export function rotaNaoEncontrada(req, res) {
  return res.status(404).json({
    mensagem: "Rota não encontrada."
  });
}

export function tratarErros(error, req, res, next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      mensagem: "O corpo da requisição não é um JSON válido."
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      mensagem: error.message
    });
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      mensagem: "Já existe um registro com os dados informados."
    });
  }

  console.error(error);

  return res.status(500).json({
    mensagem: "Erro interno do servidor."
  });
}
