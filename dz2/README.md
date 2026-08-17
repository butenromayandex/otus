# ДЗ2: Docker-образ API

Простое Node.js (Express) API с эндпоинтами `POST /users` и `GET /health`, упакованное в multi-stage Docker-образ на `node:22-alpine`.

Образ: [butenroma/otus-api:0.0.1](https://hub.docker.com/r/butenroma/otus-api)

```bash
docker pull butenroma/otus-api:0.0.1
docker run --rm -p 8000:8000 butenroma/otus-api:0.0.1
```
