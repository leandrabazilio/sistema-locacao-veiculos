import { useState } from "react";

const ESTADO_INICIAL = {
  marca: "",
  modelo: "",
  ano: "",
  placa: "",
  valorDiaria: "",
};

export default function FormVeiculo({ aoCadastrar }) {
  const [campos, setCampos] = useState(ESTADO_INICIAL);
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    const cadastrou = await aoCadastrar({
      marca: campos.marca,
      modelo: campos.modelo,
      ano: Number(campos.ano),
      placa: campos.placa,
      valorDiaria: Number(campos.valorDiaria),
    });

    setEnviando(false);

    if (cadastrou) {
      setCampos(ESTADO_INICIAL);
    }
  }

  return (
    <form onSubmit={enviar} className="formulario formulario-grade">
      <label>
        Marca
        <input name="marca" value={campos.marca} onChange={alterar} required />
      </label>

      <label>
        Modelo
        <input name="modelo" value={campos.modelo} onChange={alterar} required />
      </label>

      <label>
        Ano
        <input
          name="ano"
          type="number"
          min="1886"
          value={campos.ano}
          onChange={alterar}
          required
        />
      </label>

      <label>
        Placa
        <input
          name="placa"
          value={campos.placa}
          onChange={alterar}
          maxLength={10}
          required
        />
      </label>

      <label>
        Valor da diária (R$)
        <input
          name="valorDiaria"
          type="number"
          min="0.01"
          step="0.01"
          value={campos.valorDiaria}
          onChange={alterar}
          required
        />
      </label>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? "Salvando..." : "Cadastrar veículo"}
      </button>
    </form>
  );
}
