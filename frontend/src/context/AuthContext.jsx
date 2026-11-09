import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, obterToken, removerToken, salvarToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(Boolean(obterToken()));

  useEffect(() => {
    if (!obterToken()) {
      return;
    }

    api
      .perfil()
      .then((dados) => setUsuario(dados.usuario))
      .catch(() => removerToken())
      .finally(() => setVerificando(false));
  }, []);

  const entrar = useCallback(async (email, senha) => {
    const dados = await api.login(email, senha);
    salvarToken(dados.token);
    setUsuario(dados.usuario);
  }, []);

  const sair = useCallback(() => {
    removerToken();
    setUsuario(null);
  }, []);

  const tratarErro = useCallback(
    (erro) => {
      if (erro.status === 401) {
        sair();
        return "Sessão expirada. Faça login novamente.";
      }

      return erro.message;
    },
    [sair]
  );

  return (
    <AuthContext.Provider value={{ usuario, verificando, entrar, sair, tratarErro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
