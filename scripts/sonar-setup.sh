#!/bin/sh
# Configura automaticamente os projetos do SonarQube via API.
# Roda como serviço no docker-compose após o SonarQube ficar pronto.

SONAR_URL="${SONAR_URL:-http://sonarqube:9000}"
SONAR_USER="${SONAR_ADMIN_USER:-admin}"
SONAR_PASS="${SONAR_ADMIN_PASSWORD:-admin}"

# ─── Aguardar SonarQube ficar UP ────────────────────────────────────────────
echo "[sonar-setup] Aguardando SonarQube em $SONAR_URL ..."
until curl -sf "$SONAR_URL/api/system/status" 2>/dev/null | grep -q '"status":"UP"'; do
  printf '.'
  sleep 5
done
echo ""
echo "[sonar-setup] SonarQube está pronto!"

# ─── Função auxiliar: criar projeto ─────────────────────────────────────────
create_project() {
  KEY="$1"
  NAME="$2"
  echo "[sonar-setup] Criando projeto: $KEY ..."
  HTTP_STATUS=$(curl -s -o /tmp/sonar_resp.json -w "%{http_code}" \
    -u "$SONAR_USER:$SONAR_PASS" \
    -X POST "$SONAR_URL/api/projects/create" \
    -d "project=$KEY&name=$NAME&mainBranch=main")

  if [ "$HTTP_STATUS" = "200" ]; then
    echo "[sonar-setup] ✓ Projeto '$KEY' criado com sucesso."
  else
    RESPONSE=$(cat /tmp/sonar_resp.json 2>/dev/null)
    if echo "$RESPONSE" | grep -q "key_already_exists\|already_exists"; then
      echo "[sonar-setup] ℹ Projeto '$KEY' já existe, pulando."
    else
      echo "[sonar-setup] ✗ Erro ao criar '$KEY' (HTTP $HTTP_STATUS): $RESPONSE"
    fi
  fi
}

# ─── Criar projetos ──────────────────────────────────────────────────────────
create_project "brain-agriculture-backend"  "Brain+Agriculture+-+Backend"
create_project "brain-agriculture-frontend" "Brain+Agriculture+-+Frontend"

echo "[sonar-setup] ✅ Configuração do SonarQube concluída!"
echo "[sonar-setup] Acesse: $SONAR_URL/projects"
