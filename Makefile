# =============================================================================
#  Brain Agriculture — Makefile
#  Uso: make <target>   |   make help
# =============================================================================

# ─── Variáveis ───────────────────────────────────────────────────────────────
COMPOSE         := docker compose
NETWORK         := brain-agriculture-test_brain-agriculture-net
SONAR_URL_EXT   := http://localhost:9000
SONAR_URL_INT   := http://sonarqube:9000   # acessível de dentro da rede Docker
SONAR_TOKEN     ?=
SCANNER_IMAGE   := sonarsource/sonar-scanner-cli

# ─── Cores para output ───────────────────────────────────────────────────────
RESET  := \033[0m
BOLD   := \033[1m
GREEN  := \033[32m
YELLOW := \033[33m
CYAN   := \033[36m

# =============================================================================
#  🐳  DOCKER COMPOSE
# =============================================================================

.PHONY: up down restart ps logs logs-backend logs-frontend logs-sonar build

## Sobe todos os containers em background
up:
	@echo "$(CYAN)▶ Subindo stack completa...$(RESET)"
	$(COMPOSE) up -d --build

## Para e remove todos os containers
down:
	@echo "$(YELLOW)▶ Derrubando stack...$(RESET)"
	$(COMPOSE) down

## Reinicia todos os containers
restart: down up

## Lista status dos containers
ps:
	$(COMPOSE) ps

## Acompanha logs de todos os serviços
logs:
	$(COMPOSE) logs -f

## Acompanha logs somente do backend
logs-backend:
	$(COMPOSE) logs -f backend

## Acompanha logs somente do frontend
logs-frontend:
	$(COMPOSE) logs -f frontend

## Acompanha logs do SonarQube e do setup
logs-sonar:
	$(COMPOSE) logs -f sonarqube sonarqube-setup

## Rebuild das imagens sem cache
build:
	$(COMPOSE) build --no-cache

# =============================================================================
#  🧪  TESTES
# =============================================================================

.PHONY: test test-backend test-frontend coverage coverage-backend coverage-frontend

## Roda todos os testes (backend + frontend)
test: test-backend test-frontend

## Roda testes do backend
test-backend:
	@echo "$(CYAN)▶ Testes — backend...$(RESET)"
	cd backend && npm test

## Roda testes do frontend
test-frontend:
	@echo "$(CYAN)▶ Testes — frontend...$(RESET)"
	cd frontend && npm test

## Gera cobertura de todos os projetos (necessário antes do sonar)
coverage: coverage-backend coverage-frontend

## Gera relatório de cobertura do backend (coverage/lcov.info)
coverage-backend:
	@echo "$(CYAN)▶ Cobertura — backend...$(RESET)"
	cd backend && npm run test:cov

## Gera relatório de cobertura do frontend (coverage/lcov.info)
coverage-frontend:
	@echo "$(CYAN)▶ Cobertura — frontend...$(RESET)"
	cd frontend && npm run test:cov

# =============================================================================
#  📊  SONARQUBE
# =============================================================================
#
#  Pré-requisito: stack rodando  →  make up
#  Token:  acesse $(SONAR_URL_EXT) → My Account → Security → Generate Token
#  Uso:    make sonar SONAR_TOKEN=<token>
#          # ou exporte uma vez na sessão:
#          export SONAR_TOKEN=<token> && make sonar

.PHONY: sonar sonar-backend sonar-frontend sonar-token-help _check-token
.SILENT: _check-token

# target interno — não aparece no help
_check-token:
ifndef SONAR_TOKEN
	@echo ""
	@echo "$(YELLOW)$(BOLD)❌  SONAR_TOKEN não definido.$(RESET)"
	@echo ""
	@echo "  1. Acesse $(SONAR_URL_EXT)"
	@echo "  2. Vá em: My Account → Security → Generate Tokens"
	@echo "  3. Tipo: Global Analysis Token"
	@echo "  4. Execute novamente:"
	@echo "     $(BOLD)make sonar SONAR_TOKEN=<token>$(RESET)"
	@echo ""
	@exit 1
endif

## Mostra como gerar o token no SonarQube
sonar-token-help:
	@echo ""
	@echo "$(BOLD)Como gerar o token do SonarQube:$(RESET)"
	@echo "  1. Acesse $(SONAR_URL_EXT)"
	@echo "  2. Login: admin / admin"
	@echo "  3. Vá em: My Account → Security → Generate Tokens"
	@echo "  4. Tipo: Global Analysis Token"
	@echo "  5. Copie o token gerado e use em:"
	@echo "     $(BOLD)make sonar SONAR_TOKEN=<token>$(RESET)"
	@echo "     # ou para manter na sessão:"
	@echo "     $(BOLD)export SONAR_TOKEN=<token>$(RESET)"
	@echo ""

## Analisa backend + frontend no SonarQube (gera cobertura antes)
sonar: _check-token coverage sonar-backend sonar-frontend
	@echo ""
	@echo "$(GREEN)$(BOLD)✅  Análise concluída! Acesse: $(SONAR_URL_EXT)/projects$(RESET)"
	@echo ""

## Analisa somente o backend (gera cobertura antes)
sonar-backend: _check-token coverage-backend
	@echo "$(CYAN)▶ SonarScanner — backend...$(RESET)"
	docker run --rm \
		--network $(NETWORK) \
		-v "$(PWD)/backend:/usr/src" \
		$(SCANNER_IMAGE) \
		-Dsonar.host.url=$(SONAR_URL_INT) \
		-Dsonar.token=$(SONAR_TOKEN)
	@echo "$(GREEN)✓ Backend analisado$(RESET)"

## Analisa somente o frontend (gera cobertura antes)
sonar-frontend: _check-token coverage-frontend
	@echo "$(CYAN)▶ SonarScanner — frontend...$(RESET)"
	docker run --rm \
		--network $(NETWORK) \
		-v "$(PWD)/frontend:/usr/src" \
		$(SCANNER_IMAGE) \
		-Dsonar.host.url=$(SONAR_URL_INT) \
		-Dsonar.token=$(SONAR_TOKEN)
	@echo "$(GREEN)✓ Frontend analisado$(RESET)"

# =============================================================================
#  🔧  UTILITÁRIOS
# =============================================================================

.PHONY: clean prune help dev

## Remove artefatos de build e cobertura locais
clean:
	@echo "$(YELLOW)▶ Limpando artefatos...$(RESET)"
	rm -rf backend/dist backend/coverage
	rm -rf frontend/dist frontend/coverage

## Remove containers, volumes e imagens do projeto (⚠ apaga dados do banco)
prune:
	@echo "$(YELLOW)▶ Removendo containers, volumes e imagens do projeto...$(RESET)"
	$(COMPOSE) down -v --rmi local

## Sobe backend e frontend em modo dev local (sem Docker)
dev:
	@echo "$(CYAN)▶ Iniciando dev local (backend :3001 | frontend :3000)...$(RESET)"
	cd backend && npm run start:dev &
	cd frontend && npm run dev

# =============================================================================
#  ℹ️   HELP (padrão)
# =============================================================================

.DEFAULT_GOAL := help

## Exibe esta ajuda
help:
	@echo ""
	@echo "$(BOLD)Brain Agriculture — Comandos disponíveis$(RESET)"
	@echo ""
	@awk '/^## /{desc=substr($$0,4); next} /^[a-zA-Z_-]+:/{split($$1,a,":"); printf "  $(CYAN)%-22s$(RESET) %s\n", a[1], desc}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BOLD)Exemplos:$(RESET)"
	@echo "  make up                          # sobe a stack"
	@echo "  make test                         # roda todos os testes"
	@echo "  make sonar SONAR_TOKEN=<token>   # analisa no SonarQube"
	@echo "  make sonar-token-help            # como gerar o token"
	@echo ""
