import prisma from "../config/prisma.js";

export async function cadastrarVeiculo(dados) {
  const { marca, modelo, ano, placa, valorDiaria } = dados;

  if (
    !marca ||
    !modelo ||
    !ano ||
    !placa ||
    valorDiaria === undefined ||
    valorDiaria === null ||
    valorDiaria === ""
  ) {
    throw new Error("Preencha todos os campos do veículo.");
  }

  if (
    typeof marca !== "string" ||
    typeof modelo !== "string" ||
    typeof placa !== "string"
  ) {
    throw new Error("Marca, modelo e placa devem ser textos.");
  }

  const marcaFormatada = marca.trim();
  const modeloFormatado = modelo.trim();
  const anoNumerico = Number(ano);
  const valorNumerico = Number(valorDiaria);
  const placaFormatada = placa.trim().toUpperCase();

  if (!marcaFormatada || !modeloFormatado) {
    throw new Error("Marca e modelo não podem ficar vazios.");
  }

  if (
    !Number.isInteger(anoNumerico) ||
    anoNumerico < 1886 ||
    anoNumerico > new Date().getFullYear() + 1
  ) {
    throw new Error("Informe um ano válido para o veículo.");
  }

  if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    throw new Error("O valor da diária deve ser maior que zero.");
  }

  if (!/^[A-Z0-9-]{7,10}$/.test(placaFormatada)) {
    throw new Error("Informe uma placa válida.");
  }

  const placaExistente = await prisma.veiculo.findUnique({
    where: { placa: placaFormatada }
  });

  if (placaExistente) {
    throw new Error("Já existe um veículo cadastrado com esta placa.");
  }

  return await prisma.veiculo.create({
    data: {
      marca: marcaFormatada,
      modelo: modeloFormatado,
      ano: anoNumerico,
      placa: placaFormatada,
      valorDiaria: valorNumerico
    }
  });
}

export async function listarVeiculos() {
  return await prisma.veiculo.findMany();
}

export async function listarVeiculosDisponiveis() {
  return await prisma.veiculo.findMany({
    where: {
      ativo: true,
      locacoes: {
        none: {
          status: "ATIVA"
        }
      }
    }
  });
}