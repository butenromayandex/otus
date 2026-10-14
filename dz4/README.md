# ДЗ4: Helm + Users API

## Перед запуском

Нужны: `minikube`, `kubectl`, `helm`.

В `/etc/hosts`:

```
127.0.0.1 arch.homework
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
