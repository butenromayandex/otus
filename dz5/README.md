# ДЗ: Monitoring

Картинки в рамках задания с префиксом _img_*  
Для себя сделал манифесты, чтоб норм тестировать всё. Оставил в проекте. Если интересно - то инструкция ниже

Prometheus + Grafana для приложения из dz4 (app, pods, ingress, postgres).

Приложение взято из 4 задания: оно уже подходило под требования (API, БД, ingress в k8s) и было готово — отдельно писать сервис не пришлось.

## Перед запуском

Работает dz4 (`skaffold dev` или `./_init.sh`) и `minikube tunnel`.

## Запуск

```bash
./_init.sh
```

Ставит kube-prometheus-stack, postgres-exporter, ServiceMonitor’ы, включает metrics у ingress.

## Grafana

```bash
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
```

http://localhost:3000 — логин/пароль скрипт печатает в конце.

Import → `dashboard.json`.

## Нагрузка

```bash
cd ../dz4 && k6 run load.js
```

## Удаление

```bash
./_rollback.sh
```
