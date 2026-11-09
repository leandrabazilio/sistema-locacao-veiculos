import { useCallback, useEffect, useState } from "react";
import FormLocacao from "../components/FormLocacao.jsx";
import ListaLocacoes from "../components/ListaLocacoes.jsx";
import Mensagem from "../components/Mensagem.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function Locacoes() {
  const { tratarErro } = useAuth();
  const [locacoes, setLocacoes] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [finalizandoId, setFinalizandoId] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const [listaLocacoes, listaDisponiveis] = await Promise.all([
        api.listarLocacoes(),
        api.listarVeiculos(true),
      ]);

      setLocacoes(listaLocacoes);
      setDisponiveis(listaDisponiveis);
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: tratarErro(erro) });
    } finally {
      setCarregando(false);
    }
  }, [tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function registrarLocacao(dados) {
    try {
      const resposta = await api.registrarLocacao(dados);
      setMensagem({
        tipo: "sucesso",
        texto: `${resposta.mensagem} Valor total: R$ ${Number(resposta.locacao.valorTotal).toFixed(2).replace(".", ",")}.`,
      });
      await carregar();
      return true;
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: tratarErro(erro) });
      await carregar();
      return false;
    }
  }

  async function finalizarLocacao(id) {
    setFinalizandoId(id);

    try {
      const resposta = await api.finalizarLocacao(id);
      setMensagem({ tipo: "sucesso", texto: resposta.mensagem });
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: tratarErro(erro) });
    }

    await carregar();
    setFinalizandoId(null);
  }

  return (
    <>
      <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />

      <section className="cartao">
        <h2>Nova locação</h2>
        <FormLocacao veiculos={disponiveis} aoRegistrar={registrarLocacao} />
      </section>

      <section className="cartao">
        <h2>Histórico de locações</h2>
        {carregando ? (
          <p className="vazio">Carregando...</p>
        ) : (
          <ListaLocacoes
            locacoes={locacoes}
            aoFinalizar={finalizarLocacao}
            finalizandoId={finalizandoId}
          />
        )}
      </section>
    </>
  );
}
