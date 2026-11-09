import { useState } from "react";

export default function FormCadastro({ aoCadastrar, enviando }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function enviar(evento) {
    evento.preventDefault();
    const cadastrou = await aoCadastrar({ nome, email, senha });

    if (cadastrou) {
      setNome("");
      setEmail("");
      setSenha("");
    }
  }

  return (
    <form onSubmit={enviar} className="formulario">
      <label>
        Nome
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={100}
          required
        />
      </label>

      <label>
        E-mail
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Senha (mínimo 6 caracteres)
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          minLength={6}
          required
        />
      </label>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? "Cadastrando..." : "Criar conta"}
      </button>
    </form>
  );
}
