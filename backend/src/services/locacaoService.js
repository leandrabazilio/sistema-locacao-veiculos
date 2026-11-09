import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

const MILISSEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

function converterId(valor, mensagem) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(mensagem);
  }

  return id;
}

export async function criarLocacao(dados, usuarioId) {
  const { veiculoId, dataInicio, dataFim } = dados;

  if (!veiculoId || !dataInicio || !dataFim) {
    throw new AppError("Preencha todos os campos da locação.");
  }

  const idVeiculo = converterId(veiculoId, "Informe um veículo válido.");
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    throw new AppError("Informe datas válidas para a locação.");
  }

  if (fim <= inicio) {
    throw new AppError("A data de término deve ser posterior à data de início.");
  }

  const quantidadeDiarias = Math.ceil(
    (fim.getTime() - inicio.getTime()) / MILISSEGUNDOS_POR_DIA
  );

  return await prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({
      where: { id: idVeiculo }
    });

    if (!veiculo) {
      throw new AppError("Veículo não encontrado.", 404);
    }

    const locacaoAtiva = await tx.locacao.findFirst({
      where: {
        veiculoId: idVeiculo,
        status: "ATIVA"
      }
    });

    if (!veiculo.ativo || locacaoAtiva) {
      throw new AppError("Este veículo não está disponível para locação.", 409);
    }

    const reserva = await tx.veiculo.updateMany({
      where: {
        id: idVeiculo,
        ativo: true
      },
      data: {
        ativo: false
      }
    });

    if (reserva.count === 0) {
      throw new AppError("Este veículo não está disponível para locação.", 409);
    }

    const valorTotal =
      Math.round(Number(veiculo.valorDiaria) * quantidadeDiarias * 100) / 100;

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
    where: { usuarioId },
    include: { veiculo: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function finalizarLocacao(locacaoId, usuarioId) {
  const id = converterId(locacaoId, "Informe uma locação válida.");

  return await prisma.$transaction(async (tx) => {
    const locacao = await tx.locacao.findUnique({
      where: { id }
    });

    if (!locacao) {
      throw new AppError("Locação não encontrada.", 404);
    }

    if (locacao.usuarioId !== usuarioId) {
      throw new AppError("Você não tem permissão para finalizar esta locação.", 403);
    }

    if (locacao.status !== "ATIVA") {
      throw new AppError("Esta locação já foi finalizada.", 409);
    }

    const encerramento = await tx.locacao.updateMany({
      where: {
        id,
        status: "ATIVA"
      },
      data: {
        status: "FINALIZADA",
        dataDevolucao: new Date()
      }
    });

    if (encerramento.count === 0) {
      throw new AppError("Esta locação já foi finalizada.", 409);
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { ativo: true }
    });

    return await tx.locacao.findUnique({
      where: { id },
      include: { veiculo: true }
    });
  });
}
