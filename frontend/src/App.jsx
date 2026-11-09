import { useState } from "react";
import Cabecalho from "./components/Cabecalho.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Autenticacao from "./pages/Autenticacao.jsx";
import Locacoes from "./pages/Locacoes.jsx";
import Veiculos from "./pages/Veiculos.jsx";

export default function App() {
  const { usuario, verificando } = useAuth();
  const [aba, setAba] = useState("veiculos");

  if (verificando) {
    return <p className="vazio">Verificando sessão...</p>;
  }

  if (!usuario) {
    return <Autenticacao />;
  }

  return (
    <>
      <Cabecalho abaAtiva={aba} aoTrocarAba={setAba} />
      <main className="conteudo">
        {aba === "veiculos" ? <Veiculos /> : <Locacoes />}
      </main>
    </>
  );
}
