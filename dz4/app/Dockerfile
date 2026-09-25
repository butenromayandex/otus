# --- ЭТАП 1: Сборка приложения ---
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем исходный код приложения
COPY . .

# Собираем production-билд (генерирует папку dist)
RUN npm run build

# Удаляем devDependencies и оставляем только production-зависимости
RUN npm prune --production


# --- ЭТАП 2: Финальный продакшн образ ---
FROM node:20-alpine AS runner

WORKDIR /app

# Устанавливаем переменную окружения для Node в prod режим
ENV NODE_ENV=production

# Копируем только необходимые для работы файлы из этапа сборки
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Открываем порт (по умолчанию для NestJS это 3000, измените если у вас другой)
EXPOSE 3000

# Запускаем скомпилированное приложение
CMD ["node", "dist/main"]
