#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

minikube addons enable ingress

kubectl apply -f ns.yaml
kubectl apply -f dp.yaml
kubectl apply -f service.yaml

kubectl -n ingress-nginx wait --for=condition=ready pod \
  -l app.kubernetes.io/component=controller \
  --timeout=180s

kubectl apply -f ingress.yaml

echo
echo "hosts: 127.0.0.1 arch.homework"
echo "проверка в другом окне: curl http://arch.homework/health"

if pgrep -f "minikube tunnel" >/dev/null; then
  echo "minikube tunnel уже запущен"
  exit 0
fi

echo "запуск minikube tunnel (нужен sudo на порты 80/443). Терминал не закрывать."
minikube tunnel
