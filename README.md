# Sistema de Locação de Veículos

## Sobre o projeto

O Sistema de Locação de Veículos é um projeto acadêmico desenvolvido com o objetivo de gerenciar o cadastro de usuários, veículos e locações.

A aplicação permite cadastrar usuários, realizar autenticação, registrar veículos, consultar a disponibilidade e controlar o processo de locação e devolução.

O backend foi desenvolvido utilizando Node.js, Express, Prisma ORM e MySQL, com autenticação por JWT e criptografia de senhas utilizando bcryptjs.

## Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express:** criação das rotas e da API REST.
- **Prisma ORM:** comunicação e gerenciamento do banco de dados.
- **MySQL:** sistema de gerenciamento do banco de dados.
- **JWT:** autenticação e proteção das rotas.
- **bcryptjs:** criptografia das senhas.
- **React:** tecnologia utilizada no desenvolvimento do frontend.

## Estrutura do projeto

```text
sistema-locacao-veiculos/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── locacaoController.js
│   │   │   ├── usuarioController.js
│   │   │   └── veiculoController.js
│   │   │
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── locacaoRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   └── veiculoRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── locacaoService.js
│   │   │   ├── usuarioService.js
│   │   │   └── veiculoService.js
│   │   │
│   │   └── index.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── prisma7.config.ts
│
└── README.md
```

## Funcionalidades do sistema

### Usuários e autenticação

- Cadastro de usuários.
- Verificação de e-mail já cadastrado.
- Criptografia de senhas com bcryptjs.
- Login com e-mail e senha.
- Geração de token JWT.
- Proteção de rotas por autenticação.

### Veículos

- Cadastro de veículos.
- Listagem de veículos cadastrados.
- Consulta de veículos disponíveis.
- Validação das informações dos veículos.
- Verificação de placas duplicadas.
- Controle de disponibilidade.

### Locações

- Cadastro de locações vinculadas ao usuário autenticado.
- Consulta das locações do próprio usuário.
- Cálculo automático do valor total da locação.
- Controle de disponibilidade dos veículos.
- Finalização de locações.
- Registro da data efetiva de devolução.
- Liberação do veículo após a devolução.

## Modelo do banco de dados

O banco de dados possui três entidades principais:

- **Usuario:** armazena os dados dos usuários cadastrados.
- **Veiculo:** armazena as informações dos veículos.
- **Locacao:** registra as locações realizadas pelos usuários.

### Relacionamentos

- Um usuário pode realizar várias locações.
- Um veículo pode estar relacionado a várias locações ao longo do tempo.
- Cada locação pertence a um único usuário e a um único veículo.

## Como executar o projeto

### 1. Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js.
- npm.
- MySQL Server.
- Git.

### 2. Clonar o repositório

```bash
git clone https://github.com/leandrabazilio/sistema-locacao-veiculos.git
```

Acesse a pasta do projeto:

```bash
cd sistema-locacao-veiculos
```

### 3. Acessar o backend

```bash
cd backend
```

### 4. Instalar as dependências

```bash
npm install
```

### 5. Configurar o banco de dados

No MySQL, crie o banco de dados:

```sql
CREATE DATABASE locacao_veiculos;
```

Na pasta `backend`, crie um arquivo chamado `.env`, utilizando o `.env.example` como referência.

Configure as variáveis:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/locacao_veiculos"
JWT_SECRET="sua_chave_secreta"
```

Substitua `USUARIO` e `SENHA` pelas credenciais do seu MySQL. Utilize uma chave secreta própria para o JWT.

### 6. Executar as migrações

Com o banco criado e o arquivo `.env` configurado, execute:

```bash
npx prisma migrate dev
```

### 7. Gerar o Prisma Client

```bash
npx prisma generate
```

### 8. Iniciar o servidor

Para iniciar em modo de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado no endereço:

```text
http://localhost:3000
```

Para verificar se a API está funcionando, acesse:

```text
http://localhost:3000/
```

## Principais rotas da API

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/usuarios` | Cadastrar usuário | Não |
| POST | `/auth/login` | Realizar login | Não |
| POST | `/veiculos` | Cadastrar veículo | Sim |
| GET | `/veiculos` | Listar veículos | Sim |
| GET | `/veiculos/disponiveis` | Listar veículos disponíveis | Sim |
| POST | `/locacoes` | Criar locação | Sim |
| GET | `/locacoes` | Listar locações do usuário | Sim |
| PATCH | `/locacoes/:id/finalizar` | Finalizar locação | Sim |

As rotas protegidas exigem o envio do token JWT no cabeçalho da requisição:

```text
Authorization: Bearer SEU_TOKEN
```

## Regras de negócio

- Não é permitido cadastrar usuários com e-mails já existentes.
- Não é permitido cadastrar veículos com placas já cadastradas.
- O valor da diária deve ser maior que zero.
- A data final da locação deve ser posterior à data inicial.
- O sistema calcula automaticamente o valor total da locação.
- Qualquer período adicional inferior a 24 horas é contabilizado como uma diária completa.
- Um veículo não pode possuir mais de uma locação ativa simultaneamente.
- Somente o usuário responsável pode consultar e finalizar suas próprias locações.
- Ao finalizar uma locação, o veículo volta a ficar disponível.
- Uma locação já finalizada não pode ser finalizada novamente.

## Organização da arquitetura

O backend foi organizado em camadas para facilitar a manutenção e a compreensão do código:

- **Routes:** definem os endpoints da API.
- **Controllers:** recebem as requisições e retornam as respostas HTTP.
- **Services:** concentram as regras de negócio e a comunicação com o banco de dados.
- **Middlewares:** realizam a autenticação e a validação do token.
- **Config:** concentra a configuração da conexão com o banco de dados.

## Segurança

- As senhas são armazenadas utilizando hash com bcryptjs.
- A autenticação utiliza tokens JWT.
- As rotas de veículos e locações exigem autenticação.
- As informações de conexão e a chave JWT são armazenadas em variáveis de ambiente.
- O arquivo `.env` não deve ser enviado ao repositório.

## Integrantes

- **Jayane Ellen Dias Freire**
- **Leandra Gleyce Cavalcante Bazilio**

## Instituição

**Centro Universitário de João Pessoa (UNIPÊ)**

Projeto acadêmico desenvolvido como atividade prática de desenvolvimento web.