#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

RELEASE="${RELEASE:-homework}"
NS="${NS:-default}"

if [[ -z "${PG_PASSWORD:-}" ]]; then
  echo "задайте PG_PASSWORD=..." >&2
  exit 1
fi

need() {
  command -v "$1" >/dev/null || { echo "нужен $1" >&2; exit 1; }
}

need minikube
need kubectl
need helm

if ! grep -qE '[[:space:]]arch\.homework([[:space:]]|$)' /etc/hosts 2>/dev/null; then
  echo "добавь в /etc/hosts: 127.0.0.1 arch.homework" >&2
  exit 1
fi

if ! minikube status >/dev/null 2>&1; then
  echo "запуск minikube..."
  minikube start
fi

minikube addons enable ingress

kubectl -n ingress-nginx wait --for=condition=ready pod \
  -l app.kubernetes.io/component=controller \
  --timeout=180s

helm upgrade --install "$RELEASE" ./chart \
  --namespace "$NS" \
  --set postgres.password="$PG_PASSWORD" \
  --set image.pullPolicy=Always \
  --wait --timeout 5m

kubectl -n "$NS" wait --for=condition=complete \
  "job/${RELEASE}-otus-dz4-api-migrate-job" \
  --timeout=180s || true

echo
echo "hosts: 127.0.0.1 arch.homework"
echo "проверка в другом окне: npx newman run dz4.postman_collection.json"

if pgrep -f "minikube tunnel" >/dev/null; then
  echo "minikube tunnel уже запущен"
  exit 0
fi

echo "запуск minikube tunnel (нужен sudo на порты 80/443). Терминал не закрывать."
minikube tunnel
