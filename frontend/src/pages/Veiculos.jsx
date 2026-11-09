import { useCallback, useEffect, useState } from "react";
import FormVeiculo from "../components/FormVeiculo.jsx";
import ListaVeiculos from "../components/ListaVeiculos.jsx";
import Mensagem from "../components/Mensagem.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function Veiculos() {
  const { tratarErro } = useAuth();
  const [veiculos, setVeiculos] = useState([]);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);

    try {
      setVeiculos(await api.listarVeiculos(somenteDisponiveis));
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: tratarErro(erro) });
    } finally {
      setCarregando(false);
    }
  }, [somenteDisponiveis, tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function cadastrarVeiculo(dados) {
    try {
      const resposta = await api.cadastrarVeiculo(dados);
      setMensagem({ tipo: "sucesso", texto: resposta.mensagem });
      await carregar();
      return true;
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: tratarErro(erro) });
      return false;
    }
  }

  return (
    <>
      <Mensagem mensagem={mensagem} aoFechar={() => setMensagem(null)} />

      <section className="cartao">
        <h2>Cadastrar veículo</h2>
        <FormVeiculo aoCadastrar={cadastrarVeiculo} />
      </section>

      <section className="cartao">
        <div className="cartao-topo">
          <h2>Frota</h2>

          <label className="filtro">
            <input
              type="checkbox"
              checked={somenteDisponiveis}
              onChange={(e) => setSomenteDisponiveis(e.target.checked)}
            />
            Somente disponíveis
          </label>
        </div>

        {carregando ? <p className="vazio">Carregando...</p> : <ListaVeiculos veiculos={veiculos} />}
      </section>
    </>
  );
}
