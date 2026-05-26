# Brain Agriculture — Sistema de Gerenciamento de Produtores Rurais

Sistema fullstack para cadastro e gestão de produtores rurais, fazendas, safras, tipos de cultura e culturas plantadas, com dashboard analítico.

---

## Pré-requisitos

- Docker >= 24
- Docker Compose >= 2

---

## Configuração do Ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário (os valores padrão funcionam para ambiente local).

---

## Executando a Aplicação

```bash
docker-compose up --build
```

Após o build:

| Serviço     | URL                                    |
|-------------|----------------------------------------|
| Frontend    | http://localhost:3000                  |
| API         | http://localhost:3001/api/v1           |
| Swagger     | http://localhost:3001/api/docs         |
| Swagger JSON| http://localhost:3001/api/docs-json    |

---

## Executando Testes

### Via Docker

```bash
# Backend
docker-compose exec backend npm run test

# Frontend
docker-compose exec frontend npm run test
```

### Localmente

```bash
# Backend
cd backend
npm install
npm test

# Frontend
cd frontend
npm install
npm test
```

---

## Populando com Dados de Exemplo

```bash
docker-compose exec backend npm run seed
```

Ou localmente:

```bash
cd backend
npm run seed
```

O seeder é **idempotente** — pode ser executado múltiplas vezes sem duplicar dados.

---

## Cobertura de Testes

```bash
# Backend
cd backend && npm run test:cov

# Frontend
cd frontend && npm run test:cov
```

---

## SonarQube

Para análise de qualidade de código:

```bash
# Subir SonarQube
docker-compose -f docker-compose.yml -f docker-compose.sonar.yml up -d sonarqube sonarqube-db

# Aguardar inicialização (pode levar 1-2 minutos)
# Acessar http://localhost:9000 (admin/admin)
# Criar projeto e token de análise

# Rodar análise (com sonar-scanner instalado)
cd backend && sonar-scanner -Dsonar.token=<SEU_TOKEN>
cd frontend && sonar-scanner -Dsonar.token=<SEU_TOKEN>
```

---

## Arquitetura

```
┌────────────────────────────────────────┐
│          Docker Compose                │
│                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────┐│
│  │ frontend │  │ backend  │  │  db  ││
│  │  React   │→ │  NestJS  │→ │ PG   ││
│  │  :3000   │  │  :3001   │  │:5432 ││
│  └──────────┘  └──────────┘  └──────┘│
└────────────────────────────────────────┘
```

### Backend (NestJS)

- **Arquitetura em camadas**: Controller → Service → Repository → Entity
- **Módulos**: Producers, Farms, Harvests, CropTypes, PlantedCrops, Dashboard
- **Banco de dados**: PostgreSQL com TypeORM, migrations automáticas
- **Validação**: class-validator com pipes globais
- **Documentação**: Swagger/OpenAPI em `/api/docs`
- **Observabilidade**: LoggingInterceptor + GlobalExceptionFilter

### Frontend (React + Redux)

- **Estado global**: Redux Toolkit com slices por domínio
- **Componentes**: Atomic Design (atoms, molecules, organisms, pages)
- **Estilização**: Styled Components
- **Gráficos**: Recharts (PieChart)
- **Roteamento**: React Router DOM v6

---

## Diagrama ER

Ver [`docs/er-diagram.puml`](docs/er-diagram.puml)

### Entidades

| Tabela | Descrição |
|--------|-----------|
| `produtores` | Produtores rurais (CPF ou CNPJ) |
| `fazendas` | Fazendas associadas a produtores |
| `safras` | Anos/períodos de safra |
| `tipos_cultura` | Tipos de cultura (Soja, Milho, etc.) |
| `culturas_plantadas` | Relação fazenda × safra × tipo de cultura |

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `POSTGRES_DB` | Nome do banco | `brain_agriculture` |
| `POSTGRES_USER` | Usuário do banco | `brain` |
| `POSTGRES_PASSWORD` | Senha do banco | `agriculture` |
| `DATABASE_HOST` | Host do PostgreSQL | `database` (Docker) |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `PORT` | Porta da API | `3001` |
| `REACT_APP_API_URL` | URL da API para o frontend | `http://localhost:3001/api/v1` |

---

## Regras de Negócio

1. **BR-01**: CPF e CNPJ são validados pelo algoritmo oficial brasileiro.
2. **BR-02**: `area_agricultavel + area_vegetacao <= area_total` em cada fazenda.
3. **BR-03**: Documento (CPF/CNPJ) deve ser único por produtor.
4. **BR-04**: A exclusão de um produtor remove em cascata todas as fazendas e culturas plantadas.
5. **BR-05**: Uma fazenda pode ter múltiplas culturas plantadas por safra.
6. **BR-06**: O estado da fazenda deve ser uma das 27 UFs brasileiras válidas.
