import { formatarMoeda } from "../utils/formatadores.js";

export default function ListaVeiculos({ veiculos }) {
  if (veiculos.length === 0) {
    return <p className="vazio">Nenhum veículo encontrado.</p>;
  }

  return (
    <div className="tabela-rolavel">
      <table className="tabela">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Ano</th>
            <th>Placa</th>
            <th>Diária</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>
                {veiculo.marca} {veiculo.modelo}
              </td>
              <td>{veiculo.ano}</td>
              <td>{veiculo.placa}</td>
              <td>{formatarMoeda(veiculo.valorDiaria)}</td>
              <td>
                <span className={veiculo.ativo ? "selo selo-verde" : "selo selo-cinza"}>
                  {veiculo.ativo ? "Disponível" : "Locado"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
