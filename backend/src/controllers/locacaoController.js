import {
  criarLocacao,
  listarLocacoes,
  finalizarLocacao
} from "../services/locacaoService.js";

export async function criar(req, res) {
  const locacao = await criarLocacao(req.body ?? {}, req.usuario.id);

  return res.status(201).json({
    mensagem: "Locação realizada com sucesso!",
    locacao
  });
}

export async function buscarTodas(req, res) {
  const locacoes = await listarLocacoes(req.usuario.id);

  return res.status(200).json(locacoes);
}

export async function finalizar(req, res) {
  const locacao = await finalizarLocacao(req.params.id, req.usuario.id);

  return res.status(200).json({
    mensagem: "Locação finalizada e veículo devolvido com sucesso!",
    locacao
  });
}
