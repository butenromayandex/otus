#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

kubectl delete -f sm.yaml \
  -f ingress-sm.yaml \
  -f ingress-metrics-svc.yaml \
  -f postgres-exporter-sm.yaml \
  -f postgres-exporter.yaml \
  --ignore-not-found

helm uninstall monitoring -n monitoring || true
kubectl delete ns monitoring --ignore-not-found --wait=false

echo "мониторинг удалён"
