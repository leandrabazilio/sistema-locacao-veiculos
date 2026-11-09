import { formatarData, formatarMoeda } from "../utils/formatadores.js";

export default function ListaLocacoes({ locacoes, aoFinalizar, finalizandoId }) {
  if (locacoes.length === 0) {
    return <p className="vazio">Você ainda não possui locações.</p>;
  }

  return (
    <div className="tabela-rolavel">
      <table className="tabela">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Início</th>
            <th>Devolução prevista</th>
            <th>Devolvido em</th>
            <th>Valor total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => (
            <tr key={locacao.id}>
              <td>
                {locacao.veiculo.marca} {locacao.veiculo.modelo}
                <small className="detalhe">{locacao.veiculo.placa}</small>
              </td>
              <td>{formatarData(locacao.dataInicio)}</td>
              <td>{formatarData(locacao.dataFim)}</td>
              <td>{formatarData(locacao.dataDevolucao)}</td>
              <td>{formatarMoeda(locacao.valorTotal)}</td>
              <td>
                <span
                  className={
                    locacao.status === "ATIVA" ? "selo selo-azul" : "selo selo-cinza"
                  }
                >
                  {locacao.status === "ATIVA" ? "Ativa" : "Finalizada"}
                </span>
              </td>
              <td>
                {locacao.status === "ATIVA" && (
                  <button
                    type="button"
                    className="botao botao-secundario"
                    disabled={finalizandoId === locacao.id}
                    onClick={() => aoFinalizar(locacao.id)}
                  >
                    {finalizandoId === locacao.id ? "Finalizando..." : "Finalizar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
