#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# нужен уже запущенный dz4 (homework) + minikube

minikube addons enable ingress
minikube addons enable metrics-server

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  --wait --timeout 10m

# metrics у nginx-ingress (в minikube addon по умолчанию часто выключены)
kubectl -n ingress-nginx patch configmap ingress-nginx-controller \
  --type merge -p '{"data":{"enable-metrics":"true"}}'
kubectl -n ingress-nginx patch deploy ingress-nginx-controller --type='json' -p='[
  {"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--enable-metrics=true"}
]' || true
kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller --timeout=180s

kubectl apply -f postgres-exporter.yaml
kubectl apply -f sm.yaml
kubectl apply -f ingress-metrics-svc.yaml
kubectl apply -f ingress-sm.yaml
kubectl apply -f postgres-exporter-sm.yaml

echo
echo "готово"
echo
echo "grafana:"
echo "  kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80"
echo "  http://localhost:3000"
echo -n "  user: "
kubectl -n monitoring get secret monitoring-grafana \
  -o jsonpath='{.data.admin-user}' | base64 -d; echo
echo -n "  pass: "
kubectl -n monitoring get secret monitoring-grafana \
  -o jsonpath='{.data.admin-password}' | base64 -d; echo
echo
echo "dashboard: Import → dashboard.json"
echo "нагрузка: cd ../dz4 && k6 run load.js"
