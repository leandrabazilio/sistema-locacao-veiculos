import {
  criarLocacao,
  listarLocacoes,
  finalizarLocacao
} from "../services/locacaoService.js";

export async function criar(req, res) {
  try {
    const locacao = await criarLocacao(req.body, req.usuario.id);

    return res.status(201).json({
      mensagem: "Locação realizada com sucesso!",
      locacao
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      mensagem: error.message
    });
  }
}

export async function buscarTodas(req, res) {
  try {
    const locacoes = await listarLocacoes(req.usuario.id);

    return res.status(200).json(locacoes);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar locações."
    });
  }
}

export async function finalizar(req, res) {
  try {
    const locacao = await finalizarLocacao(
      req.params.id,
      req.usuario.id
    );

    return res.status(200).json({
      mensagem: "Locação finalizada e veículo devolvido com sucesso!",
      locacao
    });
  } catch (error) {
    const statusCode =
     error.statusCode ||
      (error.message === "Locação não encontrada." ? 404 : 400);

    return res.status(statusCode).json({
      mensagem: error.message
    });
  }
}