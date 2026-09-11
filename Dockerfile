FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# HIGH-5: миграции не выполняются на этапе сборки — иначе сборочному окружению
# нужен доступ к боевой БД. Они применяются при старте контейнера, см. CMD ниже.
RUN npx prisma generate && npm run build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

EXPOSE 3000

# HIGH-5: процесс больше не выполняется от root
USER nextjs

# Миграции применяются при старте контейнера, до того как Next начнёт принимать
# запросы. Prisma берёт advisory-lock в БД, так что параллельный старт нескольких
# контейнеров безопасен, а уже применённые миграции пропускаются.
# Если миграция падает — контейнер не поднимается, и Coolify оставит работать старый.
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && npm run start -- -p 3000 -H 0.0.0.0"]
