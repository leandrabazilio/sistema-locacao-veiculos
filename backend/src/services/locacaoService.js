import prisma from "../config/prisma.js";

export async function criarLocacao(dados, usuarioId) {
  const { veiculoId, dataInicio, dataFim } = dados;

  if (!veiculoId || !dataInicio || !dataFim) {
    throw new Error("Preencha todos os campos da locação.");
  }

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const idVeiculo = Number(veiculoId);

  if (
    !Number.isInteger(idVeiculo) ||
    idVeiculo <= 0 ||
    isNaN(inicio.getTime()) ||
    isNaN(fim.getTime())
  ) {
    throw new Error("Informe dados válidos para a locação.");
  }

  if (fim <= inicio) {
    throw new Error("A data de término deve ser posterior à data de início.");
  }

  const diferenca = fim.getTime() - inicio.getTime();
  const quantidadeDiarias = Math.ceil(
    diferenca / (1000 * 60 * 60 * 24)
  );

  return await prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({
      where: { id: idVeiculo }
    });

    if (!veiculo) {
      throw new Error("Veículo não encontrado.");
    }

    if (!veiculo.ativo) {
      throw new Error("Este veículo não está disponível para locação.");
    }

    const locacaoAtiva = await tx.locacao.findFirst({
      where: {
        veiculoId: idVeiculo,
        status: "ATIVA"
      }
    });

    if (locacaoAtiva) {
      throw new Error("Este veículo já possui uma locação ativa.");
    }

    const atualizacao = await tx.veiculo.updateMany({
      where: {
        id: idVeiculo,
        ativo: true
      },
      data: {
        ativo: false
      }
    });

    if (atualizacao.count === 0) {
      throw new Error("Este veículo não está disponível para locação.");
    }

    const valorTotal =
      Number(veiculo.valorDiaria) * quantidadeDiarias;

    return await tx.locacao.create({
      data: {
        usuarioId,
        veiculoId: idVeiculo,
        dataInicio: inicio,
        dataFim: fim,
        valorTotal,
        status: "ATIVA"
      },
      include: {
        veiculo: true
      }
    });
  });
}

export async function listarLocacoes(usuarioId) {
  return await prisma.locacao.findMany({
    where: {
      usuarioId
    },
    include: {
      veiculo: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function finalizarLocacao(locacaoId, usuarioId) {
  const id = Number(locacaoId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Informe uma locação válida.");
  }

  return await prisma.$transaction(async (tx) => {
    const locacao = await tx.locacao.findFirst({
      where: {
        id,
        usuarioId
      }
    });

    if (!locacao) {
      throw new Error("Locação não encontrada.");
    }

    if (locacao.status !== "ATIVA") {
      throw new Error("Esta locação já foi finalizada.");
    }

    const dataDevolucao = new Date();

    await tx.locacao.update({
      where: { id },
      data: {
        status: "FINALIZADA",
        dataDevolucao
      }
    });

    await tx.veiculo.update({
      where: {
        id: locacao.veiculoId
      },
      data: {
        ativo: true
      }
    });

    return await tx.locacao.findUnique({
      where: { id },
      include: {
        veiculo: true
      }
    });
  });
}