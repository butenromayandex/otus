FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

COPY app.js server.js ./
COPY src/ ./src/

USER node

EXPOSE 8000

CMD ["node", "server.js"]
