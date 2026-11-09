# Sistema de Locação de Veículos

## Sobre o projeto

O Sistema de Locação de Veículos é um projeto acadêmico da disciplina Programação com Frameworks Web. Ele permite cadastrar usuários, autenticar, cadastrar veículos, consultar a disponibilidade e registrar locações e devoluções.

O backend usa Node.js, Express, Prisma ORM e MySQL, com autenticação JWT e senhas protegidas com bcryptjs. O frontend usa React com Vite e consome a API com `fetch`.

## Tecnologias utilizadas

- **Node.js e Express:** API REST.
- **Prisma ORM e MySQL:** persistência relacional, relacionamentos e migrations.
- **JWT:** autenticação das rotas protegidas.
- **bcryptjs:** hash das senhas.
- **React (Vite):** interface web.

## Estrutura do projeto

```text
sistema-locacao-veiculos/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/prisma.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/AppError.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── prisma.config.ts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── utils/formatadores.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Funcionalidades

### Usuários e autenticação

- Cadastro de usuário com nome, e-mail e senha (hash com bcryptjs).
- Login com e-mail e senha, retornando um token JWT.
- Middleware que valida `Authorization: Bearer <token>` e confirma que o usuário ainda existe.
- A senha nunca é devolvida pela API.

### Veículos

- Cadastro com validação de campos, placa única e diária maior que zero.
- Listagem de todos os veículos e consulta apenas dos disponíveis.

### Locações

- Registro de locação para o usuário autenticado (o usuário vem do token, nunca do corpo da requisição).
- Listagem do histórico do usuário autenticado, com os dados do veículo (`include`).
- Cálculo do valor total no backend: qualquer fração de 24 horas conta como uma diária completa.
- Finalização com registro da data de devolução e liberação do veículo.

### Frontend

- Telas de cadastro e login, exibição do usuário logado e logout.
- Veículos: formulário de cadastro, listagem e filtro "somente disponíveis".
- Locações: escolha do veículo, datas, registro, histórico com valor total e botão de finalizar.
- Mensagens de sucesso e erro vindas da API; o token é validado pelo backend ao abrir a aplicação (`GET /auth/perfil`).

## Modelo do banco de dados

| Entidade | Campos principais |
|---|---|
| **Usuario** | `id` (PK), `nome`, `email` (único), `senha` (hash), `createdAt`, `updatedAt` |
| **Veiculo** | `id` (PK), `marca`, `modelo`, `ano`, `placa` (única), `valorDiaria`, `ativo`, `createdAt`, `updatedAt` |
| **Locacao** | `id` (PK), `usuarioId` (FK), `veiculoId` (FK), `dataInicio`, `dataFim` (devolução prevista), `dataDevolucao` (opcional), `valorTotal`, `status` (`ATIVA`, `FINALIZADA`, `CANCELADA`), `createdAt`, `updatedAt` |

O campo `ativo` de `Veiculo` representa a disponibilidade: `true` quando o veículo está livre e `false` enquanto há uma locação ativa.

### Relacionamentos

- Um `Usuario` possui várias `Locacao` (1:N) por `Locacao.usuarioId`.
- Um `Veiculo` possui várias `Locacao` ao longo do tempo (1:N) por `Locacao.veiculoId`.
- As chaves estrangeiras usam `ON DELETE RESTRICT`, preservando o histórico.

## Como executar o projeto

### 1. Pré-requisitos

- Node.js 20 ou superior e npm.
- MySQL Server.
- Git.

### 2. Clonar o repositório

```bash
git clone https://github.com/leandrabazilio/sistema-locacao-veiculos.git
cd sistema-locacao-veiculos
```

### 3. Backend

```bash
cd backend
npm install
```

Crie o banco no MySQL:

```sql
CREATE DATABASE locacao_veiculos;
```

Crie o arquivo `.env` a partir do `.env.example` e preencha:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/locacao_veiculos"
JWT_SECRET="defina_uma_chave_secreta"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Aplique as migrations, gere o Prisma Client e carregue os dados de exemplo:

```bash
npx prisma migrate dev
npx prisma generate
npm run seed
```

Inicie a API:

```bash
npm run dev
```

A API ficará em `http://localhost:3000`.

### 4. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A interface ficará em `http://localhost:5173`.

### 5. Dados de exemplo

O comando `npm run seed` cria (sem duplicar se executado de novo):

- Usuários `maria@exemplo.com` e `joao@exemplo.com`, ambos com a senha `123456`.
- Seis veículos, sendo um deles (Toyota Corolla) já locado.
- Duas locações da Maria: uma finalizada e uma ativa.

## Rotas da API

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/usuarios` | Cadastrar usuário | Não |
| POST | `/auth/login` | Login, retorna o JWT | Não |
| GET | `/auth/perfil` | Dados do usuário autenticado | Sim |
| POST | `/veiculos` | Cadastrar veículo | Sim |
| GET | `/veiculos` | Listar veículos | Sim |
| GET | `/veiculos/disponiveis` | Listar veículos disponíveis | Sim |
| POST | `/locacoes` | Registrar locação | Sim |
| GET | `/locacoes` | Listar locações do usuário | Sim |
| PATCH | `/locacoes/:id/finalizar` | Finalizar locação | Sim |

Exemplo de corpo para `POST /locacoes`:

```json
{
  "veiculoId": 2,
  "dataInicio": "2026-11-10T10:00:00.000Z",
  "dataFim": "2026-11-13T10:00:00.000Z"
}
```

### Códigos HTTP

| Código | Uso |
|---|---|
| 200 / 201 | Sucesso / recurso criado |
| 400 | Dados inválidos |
| 401 | Token ausente, inválido ou credenciais incorretas |
| 403 | Finalizar locação de outro usuário |
| 404 | Veículo, locação ou rota inexistente |
| 409 | Conflito: e-mail ou placa duplicados, veículo indisponível, locação já finalizada |
| 500 | Erro interno |

## Regras de negócio

- E-mails e placas não podem ser duplicados.
- O valor da diária deve ser maior que zero.
- A data de devolução prevista deve ser posterior à data de início.
- O valor total é calculado no backend, contando qualquer fração de 24 horas como diária completa.
- Um veículo não pode ter mais de uma locação ativa; ao iniciar a locação ele fica indisponível.
- Somente o dono da locação pode consultá-la e finalizá-la.
- Ao finalizar, o veículo volta a ficar disponível; uma locação finalizada não pode ser finalizada de novo.
- Veículos e locações não são excluídos, preservando o histórico.

## Arquitetura e decisões

- **Routes:** mapeiam endpoints e aplicam o middleware de autenticação.
- **Controllers:** recebem a requisição HTTP e devolvem a resposta.
- **Services:** concentram validações, regras de negócio e acesso ao Prisma.
- **Middlewares:** autenticação JWT, CORS e tratamento centralizado de erros.
- **AppError:** erro com código HTTP lançado pelos services; o middleware de erros converte em resposta JSON.

### Concorrência

Criação e finalização de locação rodam dentro de `prisma.$transaction`. O veículo só é reservado por um `updateMany` condicional (`where ativo = true`), e a locação só é encerrada por um `updateMany` condicional (`where status = ATIVA`). Em duas requisições simultâneas, apenas uma altera uma linha; a outra recebe `409`.

## Frontend (React)

O frontend fica em `frontend/`, foi criado com Vite e usa React com componentes funcionais e hooks.

### Organização

| Pasta / arquivo | Função |
|---|---|
| `src/main.jsx` | Ponto de entrada; renderiza `App` dentro do `AuthProvider`. |
| `src/App.jsx` | Define a tela exibida: verificação de sessão, autenticação ou área logada com abas. |
| `src/context/AuthContext.jsx` | Estado global do usuário autenticado (`usuario`, `entrar`, `sair`, `tratarErro`). |
| `src/services/api.js` | Camada de acesso à API com `fetch`; envia o token em `Authorization: Bearer`. |
| `src/pages/` | `Autenticacao`, `Veiculos` e `Locacoes`. Buscam dados, guardam o estado e tratam as respostas. |
| `src/components/` | `Cabecalho`, `Mensagem`, `FormLogin`, `FormCadastro`, `FormVeiculo`, `ListaVeiculos`, `FormLocacao`, `ListaLocacoes`. |
| `src/utils/formatadores.js` | Formatação de moeda e datas no padrão brasileiro. |
| `src/styles.css` | Estilos da interface (responsiva). |

### Telas

- **Entrar / Cadastrar:** formulários de login e de criação de conta.
- **Veículos:** formulário de cadastro, tabela da frota e filtro "Somente disponíveis".
- **Minhas locações:** escolha do veículo disponível e das datas, registro da locação, histórico com valor total e botão "Finalizar" nas locações ativas.

### Como funciona

- Formulários controlados: cada campo tem estado em `useState`, com `value` e `onChange`.
- Ao enviar, o formulário chama uma função recebida por props; a página chama a API, exibe a mensagem de sucesso ou erro e recarrega as listas, atualizando a interface.
- O token JWT fica no `localStorage`. Ao abrir a aplicação, `GET /auth/perfil` confirma no backend que o token ainda é válido; se não for, o usuário volta para o login.
- Respostas 401 em operações protegidas encerram a sessão automaticamente.
- O valor total da locação é calculado no backend e apenas exibido pelo frontend.

### Configuração

O endereço da API é definido em `frontend/.env` pela variável `VITE_API_URL` (padrão `http://localhost:3000`). O backend precisa ter `FRONTEND_URL` igual ao endereço do frontend (padrão `http://localhost:5173`) para liberar o CORS.

## Segurança

- Senhas com hash bcryptjs, nunca em texto puro nem nas respostas.
- Segredo do JWT e conexão com o banco em variáveis de ambiente; o `.env` não é versionado.

## Integrantes

- **Jayane Ellen Dias Freire**
- **Leandra Gleyce Cavalcante Bazilio**

## Instituição

**Centro Universitário de João Pessoa (UNIPÊ)**

Projeto acadêmico desenvolvido como atividade prática da disciplina Programação com Frameworks Web.
