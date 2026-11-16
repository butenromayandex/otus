# ДЗ6: EFK

Команды из каталога `dz6`. Приложение из ДЗ4 ставится в тот же кластер, namespace `logging`.

В `/etc/hosts`:

```
127.0.0.1 arch.homework kibana.homework
```

```bash
minikube start
minikube addons enable ingress

helm upgrade --install efk chart

helm upgrade --install users ../dz4/chart -n logging \
  --set postgres.password=qwerty \
  --set image.repository=butenroma/dz4-users \
  --set image.tag=0.1.0 \
  --set image.pullPolicy=IfNotPresent
```

Namespace `logging` создаёт шаблон чарта EFK. Ingress приложения (`arch.homework`, класс `nginx`) создаёт чарт ДЗ4.

`minikube tunnel` — в отдельном терминале, его не закрывать. Нужен sudo на порты 80 и 443.

```bash
minikube tunnel
```

Приложение: `http://arch.homework`. Kibana: `http://kibana.homework`. Ingress Kibana создаёт чарт EFK, класс `nginx`.

В Kibana: Stack Management → Index Patterns → `fluent-bit-logs-*`, поле времени `@timestamp`, затем Discover.

## Удаление

```bash
helm uninstall users -n logging
helm uninstall efk
kubectl delete pvc -n logging --all
```
