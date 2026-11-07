# ДЗ4: Helm + Users API

## Перед запуском

Нужны: `minikube`, `kubectl`, `helm`.

В `/etc/hosts`:

```
127.0.1.0 arch.homework
```

## Запуск

```bash
PG_PASSWORD=secret ./_init.sh
```

Включает ingress-addon, ставит Helm release `homework` (образ `butenroma/dz4-users` с Docker Hub), запускает `minikube tunnel`. Терминал оставить открытым (sudo на 80/443). Проверку — в другом окне.

## Проверка

```bash
npx newman run dz4.postman_collection.json
```

Коллекция бьёт в `http://arch.homework`.

## Удаление

```bash
./_rollback.sh
```

## Сборка образа (amd64 + arm64)

Из каталога `app/`:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --provenance=false \
  -t butenroma/dz4-users:0.1.0 \
  --push \
  .
```
