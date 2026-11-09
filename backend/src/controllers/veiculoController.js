import {
  cadastrarVeiculo,
  listarVeiculos,
  listarVeiculosDisponiveis
} from "../services/veiculoService.js";

export async function criarVeiculo(req, res) {
  const veiculo = await cadastrarVeiculo(req.body ?? {});

  return res.status(201).json({
    mensagem: "Veículo cadastrado com sucesso!",
    veiculo
  });
}

export async function buscarVeiculos(req, res) {
  const veiculos = await listarVeiculos();

  return res.status(200).json(veiculos);
}

export async function buscarVeiculosDisponiveis(req, res) {
  const veiculos = await listarVeiculosDisponiveis();

  return res.status(200).json(veiculos);
}
