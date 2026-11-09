import { useState } from "react";
import { formatarMoeda } from "../utils/formatadores.js";

const ESTADO_INICIAL = {
  veiculoId: "",
  dataInicio: "",
  dataFim: "",
};

export default function FormLocacao({ veiculos, aoRegistrar }) {
  const [campos, setCampos] = useState(ESTADO_INICIAL);
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    const registrou = await aoRegistrar({
      veiculoId: Number(campos.veiculoId),
      dataInicio: new Date(campos.dataInicio).toISOString(),
      dataFim: new Date(campos.dataFim).toISOString(),
    });

    setEnviando(false);

    if (registrou) {
      setCampos(ESTADO_INICIAL);
    }
  }

  return (
    <form onSubmit={enviar} className="formulario formulario-grade">
      <label className="campo-largo">
        Veículo disponível
        <select name="veiculoId" value={campos.veiculoId} onChange={alterar} required>
          <option value="">Selecione um veículo</option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} ({veiculo.placa}) -{" "}
              {formatarMoeda(veiculo.valorDiaria)}/dia
            </option>
          ))}
        </select>
      </label>

      <label>
        Início
        <input
          name="dataInicio"
          type="datetime-local"
          value={campos.dataInicio}
          onChange={alterar}
          required
        />
      </label>

      <label>
        Devolução prevista
        <input
          name="dataFim"
          type="datetime-local"
          value={campos.dataFim}
          onChange={alterar}
          required
        />
      </label>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? "Registrando..." : "Registrar locação"}
      </button>
    </form>
  );
}
