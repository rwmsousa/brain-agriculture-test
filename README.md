# Brain Agriculture — Sistema de Gestao de Produtores Rurais

Sistema fullstack para cadastro e gestao de **produtores rurais**, **fazendas**,
**safras**, **tipos de cultura** e **culturas plantadas**, com **dashboard
analitico** em tempo real.

---

## Visao Geral

O **Brain Agriculture** e uma plataforma de gerenciamento agropecuario que permite:

- Cadastrar **produtores rurais** com CPF ou CNPJ,
  com validacao pelo algoritmo oficial brasileiro.
- Registrar **fazendas** vinculadas a cada produtor,
  com controle de area total, agricultavel e de vegetacao.
- Organizar **safras** (ex.: *Safra 2023/2024*) e **tipos de cultura**
  (Soja, Milho, Algodao, etc.).
- Associar **culturas plantadas** a cada fazenda por safra.
- Visualizar **estatisticas consolidadas** no dashboard: total de fazendas,
  hectares, distribuicao por estado, por tipo de cultura e uso do solo.

**Stack:** React + Redux Toolkit (frontend) · NestJS + TypeORM +
PostgreSQL (backend) · Docker Compose.

---

## Telas da Aplicacao

### 1. Dashboard

**Rota:** `/`

Painel analitico com visualizacoes em grafico de pizza:

| Card | Conteudo |
| --- | --- |
| **Total de Fazendas** | Numero absoluto de fazendas cadastradas |
| **Total de Hectares** | Soma de toda a area registrada |
| **Por Estado** | Distribuicao percentual das fazendas por UF |
| **Por Cultura** | Distribuicao das culturas plantadas (Soja, Milho, etc.) |
| **Uso do Solo** | Proporcao entre area agricultavel e area de vegetacao |

---

### 2. Produtores

**Rota:** `/producers`

Lista todos os produtores cadastrados em tabela com:

- Nome (link para o detalhe do produtor)
- Documento mascarado (CPF ou CNPJ)
- Numero de fazendas associadas
- Acoes: **Editar** (abre o formulario inline) e **Excluir**
  (com dialogo de confirmacao)

Botao **"+ Novo Produtor"** abre o formulario unificado de cadastro.

---

### 3. Cadastro e Edicao de Produtor

**Rota:** `/producers` (inline via formulario)

Formulario unificado que cadastra produtor e fazenda em uma unica etapa.

#### Dados do produtor

- Nome completo
- Tipo de documento (CPF / CNPJ) — altera placeholder e validacao
  automaticamente
- Numero do documento (validado pelo algoritmo oficial)

#### Dados da fazenda

- Nome, cidade e estado (seletor com 27 UFs)
- Area total, agricultavel e de vegetacao (em hectares)
- Validacao: `area_agricultavel + area_vegetacao <= area_total`

#### Culturas plantadas (opcional)

- Botao "+ Adicionar Cultura" inclui uma linha com seletores de safra
  e tipo de cultura
- Cada linha pode ser removida individualmente

---

### 4. Detalhe do Produtor

**Rota:** `/producers/:id`

Exibe o perfil completo do produtor com:

- Dados cadastrais e documento (mascarado)
- Lista de fazendas com suas areas
- Para cada fazenda: culturas plantadas por safra, com opcao de
  adicionar/remover culturas
- Link de voltar para a lista de produtores

---

### 5. Configuracoes

**Rota:** `/config`

Area de gerenciamento dos dados de referencia:

| Aba | Funcionalidade |
| --- | --- |
| **Safras** | Lista safras cadastradas e permite criar novas |
| **Tipos de Cultura** | Lista e cria tipos de cultura para uso nos formularios |

---

## Pre-requisitos

- [Docker](https://docs.docker.com/get-docker/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) >= 2
  (ja incluido no Docker Desktop)

> **Sem necessidade de Node.js local** — tudo roda via containers.

---

## Subindo com Docker

### 1. Clone o repositorio

```bash
git clone git@github.com:rwmsousa/brain-agriculture-test.git
cd brain-agriculture-test
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

> Os valores padrao do `.env.example` funcionam para desenvolvimento local
> sem nenhuma alteracao.

### 3. Suba a stack completa

```bash
docker compose up --build
```

Ou usando o Makefile:

```bash
make up
```

> O primeiro build pode levar 2-4 minutos (download de imagens + instalacao
> de dependencias). Aguarde ate ver:
> `backend | NestJS application is running on port 3001`.

### 4. (Opcional) Popule com dados de exemplo

```bash
docker compose exec backend npm run seed
```


---

## URLs de Acesso

| Servico | URL | Descricao |
| --- | --- | --- |
| **Frontend** | <http://localhost:3000> | Interface React |
| **API REST** | <http://localhost:3001/api/v1> | Endpoints da aplicacao |
| **Swagger UI** | <http://localhost:3001/api/docs> | Documentacao interativa |
| **Swagger JSON** | <http://localhost:3001/api/docs-json> | Schema OpenAPI |
| **SonarQube** | <http://localhost:9000> | Analise de qualidade |

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

# Com relatorio de cobertura
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

## SonarQube — Analise de Qualidade

O SonarQube ja esta incluido no `docker-compose.yml`.

### Passo 1 — Subir o SonarQube

Se a stack ja esta no ar (`make up`), o SonarQube sobe junto.
Para subir apenas o SonarQube de forma isolada:

```bash
docker compose up -d sonarqube sonarqube-db sonarqube-setup
```

> A inicializacao completa leva **1-2 minutos**.
> Aguarde ate <http://localhost:9000> responder.

### Passo 2 — Acessar e fazer login

Acesse <http://localhost:9000> com as credenciais abaixo:

| Campo | Valor padrao |
| --- | --- |
| Usuario | `admin` |
| Senha | `admin` |

> Na primeira vez, o SonarQube solicitara a troca de senha.
> O servico `sonarqube-setup` cria automaticamente os projetos
> `brain-agriculture-backend` e `brain-agriculture-frontend`.

### Passo 3 — Gerar um Token de Analise

1. Apos o login, clique no seu avatar (canto superior direito)
   e va em **My Account**
2. Clique na aba **Security**
3. Em **Generate Tokens**, preencha:
   - **Name:** `brain-agriculture-scanner` (qualquer nome)
   - **Type:** `Global Analysis Token`
   - **Expires in:** `No expiration` (ou o prazo desejado)
4. Clique em **Generate**
5. **Copie o token gerado** — ele so e exibido uma vez

Para ver as instrucoes diretamente no terminal:

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
> Nao e necessario instalar o scanner localmente.

### Passo 5 — Ver os resultados

Acesse <http://localhost:9000/projects> e clique no projeto desejado para
visualizar cobertura de testes, code smells, bugs e vulnerabilidades.

---

## Arquitetura

### Backend — NestJS

| Aspecto | Detalhe |
| --- | --- |
| Arquitetura | Controller -> Service -> Repository -> Entity |
| Modulos | Producers, Farms, Harvests, CropTypes, PlantedCrops, Dashboard |
| Banco | PostgreSQL 15 + TypeORM + migrations automaticas |
| Validacao | class-validator com ValidationPipe global |
| Documentacao | Swagger/OpenAPI em `/api/docs` |
| Testes | Jest + @nestjs/testing |

### Frontend — React

| Aspecto | Detalhe |
| --- | --- |
| Estado global | Redux Toolkit com slices por dominio |
| Componentes | Atomic Design: atoms, molecules, organisms, pages |
| Estilizacao | Styled Components |
| Graficos | Recharts (PieChart) |
| Roteamento | React Router DOM v6 |
| Testes | Jest + React Testing Library |

---

## Variaveis de Ambiente

Copie `.env.example` com `cp .env.example .env` e ajuste conforme necessario.

| Variavel | Descricao | Padrao |
| --- | --- | --- |
| `POSTGRES_DB` | Nome do banco de dados | `brain_agriculture` |
| `POSTGRES_USER` | Usuario do banco | `brain` |
| `POSTGRES_PASSWORD` | Senha do banco | `agriculture` |
| `DATABASE_HOST` | Host do PostgreSQL | `database` (Docker) |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `PORT` | Porta da API NestJS | `3001` |
| `REACT_APP_API_URL` | URL da API consumida pelo frontend | `http://localhost:3001/api/v1` |
| `SONAR_ADMIN_PASSWORD` | Senha do admin no SonarQube | `admin` |

---

## Regras de Negocio

| # | Regra |
| --- | --- |
| BR-01 | CPF e CNPJ sao validados pelo algoritmo oficial brasileiro. |
| BR-02 | `area_agricultavel + area_vegetacao <= area_total` em cada fazenda. |
| BR-03 | O documento (CPF ou CNPJ) deve ser unico entre os produtores. |
| BR-04 | Excluir um produtor remove em cascata suas fazendas e culturas. |
| BR-05 | Uma fazenda pode ter multiplas culturas por safra, mas nao a mesma cultura duplicada. |
| BR-06 | O estado da fazenda deve ser uma das 27 UFs brasileiras validas. |

---

## Diagrama ER

O diagrama completo esta em [`docs/er-diagram.puml`](docs/er-diagram.puml)
(PlantUML).

```text
produtores
  +-- fazendas (1:N)
        +-- culturas_plantadas (1:N)
              +-- safras
              +-- tipos_cultura
```

| Tabela | Descricao |
| --- | --- |
| `produtores` | Produtores rurais — CPF ou CNPJ unico |
| `fazendas` | Fazendas de um produtor, com areas em hectares |
| `safras` | Periodos de safra (ex.: Safra 2023/2024) |
| `tipos_cultura` | Tipos de cultura (Soja, Milho, Cafe, etc.) |
| `culturas_plantadas` | Relacao ternaria: fazenda x safra x tipo de cultura |

---

## Comandos Uteis (Makefile)

```bash
make help            # lista todos os comandos disponiveis
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
make coverage        # gera relatorios de cobertura
make clean           # remove dist/ e coverage/ locais
make prune           # remove containers, volumes e imagens (apaga dados)
```
