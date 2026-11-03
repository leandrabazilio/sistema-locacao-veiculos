import {
  cadastrarVeiculo,
  listarVeiculos,
  listarVeiculosDisponiveis
} from "../services/veiculoService.js";

export async function criarVeiculo(req, res) {
  try {
    const veiculo = await cadastrarVeiculo(req.body);

    return res.status(201).json({
      mensagem: "Veículo cadastrado com sucesso!",
      veiculo
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

export async function buscarVeiculos(req, res) {
  try {
    const veiculos = await listarVeiculos();

    return res.status(200).json(veiculos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar veículos."
    });
  }
}

export async function buscarVeiculosDisponiveis(req, res) {
  try {
    const veiculos = await listarVeiculosDisponiveis();

    return res.status(200).json(veiculos);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar veículos disponíveis."
    });
  }
}