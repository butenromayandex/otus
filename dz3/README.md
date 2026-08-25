# ДЗ: Kubernetes

Образ из ДЗ2: [butenroma/otus-api:0.0.1](https://hub.docker.com/r/butenroma/otus-api)

Helm не ставил: в методичке есть установка Nginx Ingress через Helm, но мы его ещё не проходили. Контроллер взял из аддона minikube (`minikube addons enable ingress`). `ingressClassName: nginx` в манифесте указал — без класса новые версии контроллера Ingress не подхватывают.

## Перед запуском

В `/etc/hosts`:

```
127.0.0.1 arch.homework
```

Newman ставится вместе с запуском через npx (глобально ставить не обязательно).

## Запуск

```bash
./_init.sh
```

Включает ingress-addon, применяет манифесты и запускает `minikube tunnel`. Терминал оставить открытым (sudo на порты 80/443). Проверку выполнять в другом окне.

## Проверка

```bash
npx newman run dz3.postman_collection.json
```

Коллекция отправляет запросы на `http://arch.homework`: `/health` и rewrite `/otusapp/{имя}/health`.

## Удаление

```bash
./_rollback.sh
```

Останавливает tunnel, удаляет манифесты ДЗ, выключает ingress-addon.
