const URL_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const CHAVE_TOKEN = "locacao_token";

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

export function obterToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function salvarToken(token) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token);
  } catch {
    return;
  }
}

export function removerToken() {
  try {
    localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    return;
  }
}

async function requisitar(caminho, { metodo = "GET", corpo } = {}) {
  const cabecalhos = { "Content-Type": "application/json" };
  const token = obterToken();

  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta;

  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroApi("Não foi possível conectar ao servidor.", 0);
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new ErroApi(dados?.mensagem || "Erro inesperado.", resposta.status);
  }

  return dados;
}

export const api = {
  cadastrarUsuario: (dados) =>
    requisitar("/usuarios", { metodo: "POST", corpo: dados }),
  login: (email, senha) =>
    requisitar("/auth/login", { metodo: "POST", corpo: { email, senha } }),
  perfil: () => requisitar("/auth/perfil"),
  listarVeiculos: (somenteDisponiveis) =>
    requisitar(somenteDisponiveis ? "/veiculos/disponiveis" : "/veiculos"),
  cadastrarVeiculo: (dados) =>
    requisitar("/veiculos", { metodo: "POST", corpo: dados }),
  listarLocacoes: () => requisitar("/locacoes"),
  registrarLocacao: (dados) =>
    requisitar("/locacoes", { metodo: "POST", corpo: dados }),
  finalizarLocacao: (id) =>
    requisitar(`/locacoes/${id}/finalizar`, { metodo: "PATCH" }),
};
