import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

const usuarios = [
  { nome: "Maria Souza", email: "maria@exemplo.com", senha: "123456" },
  { nome: "João Pereira", email: "joao@exemplo.com", senha: "123456" },
];

const veiculos = [
  { marca: "Fiat", modelo: "Mobi", ano: 2023, placa: "ABC1D23", valorDiaria: 110 },
  { marca: "Chevrolet", modelo: "Onix", ano: 2024, placa: "BCD2E34", valorDiaria: 140 },
  { marca: "Volkswagen", modelo: "T-Cross", ano: 2023, placa: "CDE3F45", valorDiaria: 220 },
  { marca: "Toyota", modelo: "Corolla", ano: 2022, placa: "DEF4G56", valorDiaria: 260 },
  { marca: "Hyundai", modelo: "HB20", ano: 2024, placa: "EFG5H67", valorDiaria: 135 },
  { marca: "Jeep", modelo: "Renegade", ano: 2023, placa: "FGH6I78", valorDiaria: 240 },
];

const DIA = 1000 * 60 * 60 * 24;

async function main() {
  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: {
        nome: usuario.nome,
        email: usuario.email,
        senha: await bcrypt.hash(usuario.senha, 10),
      },
    });
  }

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo,
    });
  }

  const totalLocacoes = await prisma.locacao.count();

  if (totalLocacoes === 0) {
    const maria = await prisma.usuario.findUnique({ where: { email: "maria@exemplo.com" } });
    const mobi = await prisma.veiculo.findUnique({ where: { placa: "ABC1D23" } });
    const corolla = await prisma.veiculo.findUnique({ where: { placa: "DEF4G56" } });

    const agora = Date.now();

    await prisma.locacao.create({
      data: {
        usuarioId: maria.id,
        veiculoId: mobi.id,
        dataInicio: new Date(agora - 10 * DIA),
        dataFim: new Date(agora - 7 * DIA),
        dataDevolucao: new Date(agora - 7 * DIA),
        valorTotal: 330,
        status: "FINALIZADA",
      },
    });

    await prisma.locacao.create({
      data: {
        usuarioId: maria.id,
        veiculoId: corolla.id,
        dataInicio: new Date(agora - DIA),
        dataFim: new Date(agora + 2 * DIA),
        valorTotal: 780,
        status: "ATIVA",
      },
    });

    await prisma.veiculo.update({
      where: { id: corolla.id },
      data: { ativo: false },
    });
  }
}

main()
  .then(() => console.log("Dados de exemplo inseridos."))
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
