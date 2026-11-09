import { useAuth } from "../context/AuthContext.jsx";

const ABAS = [
  { id: "veiculos", rotulo: "Veículos" },
  { id: "locacoes", rotulo: "Minhas locações" },
];

export default function Cabecalho({ abaAtiva, aoTrocarAba }) {
  const { usuario, sair } = useAuth();

  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <h1 className="marca">Locadora</h1>

        <nav className="abas">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              type="button"
              className={aba.id === abaAtiva ? "aba aba-ativa" : "aba"}
              onClick={() => aoTrocarAba(aba.id)}
            >
              {aba.rotulo}
            </button>
          ))}
        </nav>

        <div className="usuario">
          <span>{usuario.nome}</span>
          <button type="button" className="botao botao-secundario" onClick={sair}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
