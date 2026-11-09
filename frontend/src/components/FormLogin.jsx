import { useState } from "react";

export default function FormLogin({ aoEntrar, enviando }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function enviar(evento) {
    evento.preventDefault();
    aoEntrar(email, senha);
  }

  return (
    <form onSubmit={enviar} className="formulario">
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
        Senha
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
