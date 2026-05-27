# Brain Agriculture — Sistema de Gestão de Produtores Rurais

Sistema fullstack para cadastro e gestão de **produtores rurais**, **fazendas**,
**safras**, **tipos de cultura** e **culturas plantadas**, com **dashboard
analítico** em tempo real.

---

## Visão Geral

O **Brain Agriculture** é uma plataforma de gerenciamento agropecuário que permite:

- Cadastrar **produtores rurais** com CPF ou CNPJ,
  com validação pelo algoritmo oficial brasileiro.
- Registrar **fazendas** vinculadas a cada produtor,
  com controle de área total, agricultável e de vegetação.
- Organizar **safras** (ex.: *Safra 2023/2024*) e **tipos de cultura**
  (Soja, Milho, Algodão, etc.).
- Associar **culturas plantadas** a cada fazenda por safra.
- Visualizar **estatísticas consolidadas** no dashboard: total de fazendas,
  hectares, distribuição por estado, por tipo de cultura e uso do solo.

**Stack:** React + Redux Toolkit (frontend) · NestJS + TypeORM +
PostgreSQL (backend) · Docker Compose.

---

## Telas da Aplicação

### 1. Dashboard

**Rota:** `/`

Painel analítico com visualizações em gráfico de pizza:

| Card | Conteúdo |
| --- | --- |
| **Total de Fazendas** | Número absoluto de fazendas cadastradas |
| **Total de Hectares** | Soma de toda a área registrada |
| **Por Estado** | Distribuição percentual das fazendas por UF |
| **Por Cultura** | Distribuição das culturas plantadas (Soja, Milho, etc.) |
| **Uso do Solo** | Proporção entre área agricultável e área de vegetação |

---

### 2. Produtores

**Rota:** `/producers`

Lista todos os produtores cadastrados em tabela com:

- Nome (link para o detalhe do produtor)
- Documento mascarado (CPF ou CNPJ)
- Número de fazendas associadas
- Ações: **Editar** (abre o formulário inline) e **Excluir**
  (com diálogo de confirmação)

Botão **"+ Novo Produtor"** abre o formulário unificado de cadastro.

---

### 3. Cadastro e Edição de Produtor

**Rota:** `/producers` (inline via formulário)

Formulário unificado que cadastra produtor e fazenda em uma única etapa.

#### Dados do produtor

- Nome completo
- Tipo de documento (CPF / CNPJ) — altera placeholder e validação
  automaticamente
- Número do documento (validado pelo algoritmo oficial)

#### Dados da fazenda

- Nome, cidade e estado (seletor com 27 UFs)
- Área total, agricultável e de vegetação (em hectares)
- Validação: `area_agricultavel + area_vegetacao <= area_total`

#### Culturas plantadas (opcional)

- Botão "+ Adicionar Cultura" inclui uma linha com seletores de safra
  e tipo de cultura
- Cada linha pode ser removida individualmente

---

### 4. Detalhe do Produtor

**Rota:** `/producers/:id`

Exibe o perfil completo do produtor com:

- Dados cadastrais e documento (mascarado)
- Lista de fazendas com suas áreas
- Para cada fazenda: culturas plantadas por safra, com opção de
  adicionar/remover culturas
- Link de voltar para a lista de produtores

---

### 5. Configurações

**Rota:** `/config`

Área de gerenciamento dos dados de referência:

| Aba | Funcionalidade |
| --- | --- |
| **Safras** | Lista safras cadastradas e permite criar novas |
| **Tipos de Cultura** | Lista e cria tipos de cultura para uso nos formulários |

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) >= 2
  (já incluído no Docker Desktop)

> **Sem necessidade de Node.js local** — tudo roda via containers.

---

## Subindo com Docker

### 1. Clone o repositório

```bash
git clone git@github.com:rwmsousa/brain-agriculture-test.git
cd brain-agriculture-test
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

> Os valores padrão do `.env.example` funcionam para desenvolvimento local
> sem nenhuma alteração.

### 3. Suba a stack completa

```bash
docker compose up --build
```

Ou usando o Makefile:

```bash
make up
```

> O primeiro build pode levar 2-4 minutos (download de imagens + instalação
> de dependências). Aguarde até ver:
> `backend | NestJS application is running on port 3001`.

### 4. (Opcional) Popule com dados de exemplo

```bash
docker compose exec backend npm run seed
```

> O seeder é **idempotente** — pode ser executado múltiplas vezes sem
> duplicar dados.

---

## URLs de Acesso

| Serviço | URL | Descrição |
| --- | --- | --- |
| **Frontend** | <http://localhost:3000> | Interface React |
| **API REST** | <http://localhost:3001/api/v1> | Endpoints da aplicação |
| **Swagger UI** | <http://localhost:3001/api/docs> | Documentação interativa |
| **Swagger JSON** | <http://localhost:3001/api/docs-json> | Schema OpenAPI |
| **SonarQube** | <http://localhost:9000> | Análise de qualidade |

---

## Rodando os Testes

### Via Makefile (recomendado)

```bash
# Todos os testes (backend + frontend)
make test

# Somente backend
make test-backend

# Somente frontend
make test-frontend

# Com relatório de cobertura
make coverage
```

### Via Docker Compose

```bash
# Backend
docker compose exec backend npm test

# Frontend
docker compose exec frontend npm test -- --watchAll=false
```

### Localmente (sem Docker)

```bash
# Backend
cd backend && npm install && npm test

# Frontend
cd frontend && npm install && npm test -- --watchAll=false
```

### Cobertura detalhada

```bash
# Backend -> gera coverage/lcov.info
cd backend && npm run test:cov

# Frontend -> gera coverage/lcov.info
cd frontend && npm run test:cov
```

---

## SonarQube — Análise de Qualidade

O SonarQube já está incluído no `docker-compose.yml`.

### Passo 1 — Subir o SonarQube

Se a stack já está no ar (`make up`), o SonarQube sobe junto.
Para subir apenas o SonarQube de forma isolada:

```bash
docker compose up -d sonarqube sonarqube-db sonarqube-setup
```

> A inicialização completa leva **1-2 minutos**.
> Aguarde até <http://localhost:9000> responder.

### Passo 2 — Acessar e fazer login

Acesse <http://localhost:9000> com as credenciais abaixo:

| Campo | Valor padrão |
| --- | --- |
| Usuário | `admin` |
| Senha | `admin` |

> Na primeira vez, o SonarQube solicitará a troca de senha.
> O serviço `sonarqube-setup` cria automaticamente os projetos
> `brain-agriculture-backend` e `brain-agriculture-frontend`.

### Passo 3 — Gerar um Token de Análise

1. Após o login, clique no seu avatar (canto superior direito)
   e vá em **My Account**
2. Clique na aba **Security**
3. Em **Generate Tokens**, preencha:
   - **Name:** `brain-agriculture-scanner` (qualquer nome)
   - **Type:** `Global Analysis Token`
   - **Expires in:** `No expiration` (ou o prazo desejado)
4. Clique em **Generate**
5. **Copie o token gerado** — ele só é exibido uma vez

Para ver as instruções diretamente no terminal:

```bash
make sonar-token-help
```

### Passo 4 — Rodar o Scanner

```bash
# Analisa backend + frontend (gera cobertura automaticamente)
make sonar SONAR_TOKEN=<seu-token>
```

Ou para projetos individuais:

```bash
make sonar-backend  SONAR_TOKEN=<seu-token>
make sonar-frontend SONAR_TOKEN=<seu-token>
```

> O Makefile utiliza o `sonar-scanner-cli` via Docker.
> Não é necessário instalar o scanner localmente.

### Passo 5 — Ver os resultados

Acesse <http://localhost:9000/projects> e clique no projeto desejado para
visualizar cobertura de testes, code smells, bugs e vulnerabilidades.

---

## Arquitetura

```text
+-----------------------------------------------------+
|                   Docker Compose                    |
|                                                     |
|  +-----------+    +-----------+    +-------------+  |
|  | frontend  |--->|  backend  |--->|  database   |  |
|  |  React    |    |  NestJS   |    | PostgreSQL  |  |
|  |  :3000    |    |  :3001    |    |   :5432     |  |
|  +-----------+    +-----------+    +-------------+  |
|                                                     |
|  +-----------+    +-----------------------------+   |
|  | sonarqube |<---| sonarqube-setup             |   |
|  |  :9000    |    | (cria projetos via API REST) |   |
|  +-----------+    +-----------------------------+   |
+-----------------------------------------------------+
```

### Backend — NestJS

| Aspecto | Detalhe |
| --- | --- |
| Arquitetura | Controller → Service → Repository → Entity |
| Módulos | Producers, Farms, Harvests, CropTypes, PlantedCrops, Dashboard |
| Banco | PostgreSQL 15 + TypeORM + migrations automáticas |
| Validação | class-validator com ValidationPipe global |
| Documentação | Swagger/OpenAPI em `/api/docs` |
| Testes | Jest + @nestjs/testing |

### Frontend — React

| Aspecto | Detalhe |
| --- | --- |
| Estado global | Redux Toolkit com slices por domínio |
| Componentes | Atomic Design: atoms, molecules, organisms, pages |
| Estilização | Styled Components |
| Gráficos | Recharts (PieChart) |
| Roteamento | React Router DOM v6 |
| Testes | Jest + React Testing Library |

---

## Variáveis de Ambiente

Copie `.env.example` com `cp .env.example .env` e ajuste conforme necessário.

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `POSTGRES_DB` | Nome do banco de dados | `brain_agriculture` |
| `POSTGRES_USER` | Usuário do banco | `brain` |
| `POSTGRES_PASSWORD` | Senha do banco | `agriculture` |
| `DATABASE_HOST` | Host do PostgreSQL | `database` (Docker) |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `PORT` | Porta da API NestJS | `3001` |
| `REACT_APP_API_URL` | URL da API consumida pelo frontend | `http://localhost:3001/api/v1` |
| `SONAR_ADMIN_PASSWORD` | Senha do admin no SonarQube | `admin` |

---

## Regras de Negócio

| # | Regra |
| --- | --- |
| BR-01 | CPF e CNPJ são validados pelo algoritmo oficial brasileiro. |
| BR-02 | `area_agricultavel + area_vegetacao <= area_total` em cada fazenda. |
| BR-03 | O documento (CPF ou CNPJ) deve ser único entre os produtores. |
| BR-04 | Excluir um produtor remove em cascata suas fazendas e culturas. |
| BR-05 | Uma fazenda pode ter múltiplas culturas por safra, mas não a mesma cultura duplicada. |
| BR-06 | O estado da fazenda deve ser uma das 27 UFs brasileiras válidas. |

---

## Diagrama ER

O diagrama completo está em [`docs/er-diagram.puml`](docs/er-diagram.puml)
(PlantUML).

```text
produtores
  +-- fazendas (1:N)
        +-- culturas_plantadas (1:N)
              +-- safras
              +-- tipos_cultura
```

| Tabela | Descrição |
| --- | --- |
| `produtores` | Produtores rurais — CPF ou CNPJ único |
| `fazendas` | Fazendas de um produtor, com áreas em hectares |
| `safras` | Períodos de safra (ex.: Safra 2023/2024) |
| `tipos_cultura` | Tipos de cultura (Soja, Milho, Café, etc.) |
| `culturas_plantadas` | Relação ternária: fazenda × safra × tipo de cultura |

---

## Comandos Úteis (Makefile)

```bash
make help            # lista todos os comandos disponíveis
make up              # sobe a stack completa
make down            # para e remove os containers
make restart         # reinicia a stack
make ps              # status dos containers
make logs            # acompanha todos os logs
make logs-backend    # logs do NestJS
make logs-frontend   # logs do nginx/React
make logs-sonar      # logs do SonarQube
make build           # rebuild sem cache
make test            # roda todos os testes
make coverage        # gera relatórios de cobertura
make clean           # remove dist/ e coverage/ locais
make prune           # remove containers, volumes e imagens (apaga dados)
```
