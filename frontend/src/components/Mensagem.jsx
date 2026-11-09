export default function Mensagem({ mensagem, aoFechar }) {
  if (!mensagem) {
    return null;
  }

  return (
    <div className={`mensagem mensagem-${mensagem.tipo}`} role="alert">
      <span>{mensagem.texto}</span>
      <button type="button" className="mensagem-fechar" onClick={aoFechar} aria-label="Fechar">
        ×
      </button>
    </div>
  );
}
