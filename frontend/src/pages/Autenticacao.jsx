import { useState } from "react";
import FormCadastro from "../components/FormCadastro.jsx";
import FormLogin from "../components/FormLogin.jsx";
import Mensagem from "../components/Mensagem.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function Autenticacao() {
  const { entrar } = useAuth();
  const [modo, setModo] = useState("login");
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function entrarNoSistema(email, senha) {
    setEnviando(true);
    setMensagem(null);

    try {
      await entrar(email, senha);
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: erro.message });
      setEnviando(false);
    }
  }

  async function cadastrarUsuario(dados) {
    setEnviando(true);
    setMensagem(null);

    try {
      await api.cadastrarUsuario(dados);
      setMensagem({ tipo: "sucesso", texto: "Conta criada! Faça login para continuar." });
      setModo("login");
      return true;
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: erro.message });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  function trocarModo(novoModo) {
    setModo(novoModo);
    setMensagem(null);
  }

  return (
    <main className="autenticacao">
      <section className="cartao cartao-estreito">
        <h1 className="titulo-auth">Locadora de Veículos</h1>

        <div className="abas abas-auth">
          <button
            type="button"
            className={modo === "login" ? "aba aba-ativa" : "aba"}
            onClick={() => trocarModo("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={modo === "cadastro" ? "aba aba-ativa" : "aba"}
            onClick={() => trocarModo("cadastro")}
          >
            Cadastrar
          </button>
        </div>

        <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />

        {modo === "login" ? (
          <FormLogin aoEntrar={entrarNoSistema} enviando={enviando} />
        ) : (
          <FormCadastro aoCadastrar={cadastrarUsuario} enviando={enviando} />
        )}
      </section>
    </main>
  );
}
