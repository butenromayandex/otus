#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

RELEASE="${RELEASE:-homework}"
NS="${NS:-default}"

pkill -f "minikube tunnel" 2>/dev/null || true

if helm status "$RELEASE" -n "$NS" >/dev/null 2>&1; then
  helm uninstall "$RELEASE" -n "$NS"
fi

kubectl -n "$NS" delete pvc \
  -l "app.kubernetes.io/instance=${RELEASE},app.kubernetes.io/component=postgres" \
  --ignore-not-found 2>/dev/null || true
kubectl -n "$NS" delete pvc postgres-data-postgres-0 --ignore-not-found 2>/dev/null || true
