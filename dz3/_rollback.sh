#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

pkill -f "minikube tunnel" 2>/dev/null || true

kubectl delete -f ingress.yaml --ignore-not-found
kubectl delete -f service.yaml --ignore-not-found
kubectl delete -f dp.yaml --ignore-not-found
kubectl delete -f ns.yaml --ignore-not-found

minikube addons disable ingress
