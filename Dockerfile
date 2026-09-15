FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

# Миграции применяются ДО `next build`, а не только при старте контейнера.
#
# Причина: Coolify подставляет свои переменные окружения (в том числе
# DATABASE_URL) и на этап сборки — перед `docker build` он дописывает в
# Dockerfile строки ARG/ENV (в логе сборки видно «transferring dockerfile:
# 4.98kB» при 1.5 kB в репозитории). А `next build` пререндерит почти весь
# сайт (~860 страниц справочника, объектов и каталога) запросами в эту самую
# боевую БД. Значит схема БД обязана совпадать с кодом уже на сборке: иначе
# любая миграция, добавляющая колонку в user/post/tour, роняет деплой ещё
# до того, как контейнер получит шанс накатить её сам.
#
# Так упал деплой b7f4ea3 (2026-09-15): пререндер /[slug] делает
# `post.findFirst({ include: { user: true } })` — то есть выбирает все колонки
# user, — а колонки `user.city` из 20260912135255_add_guide_cabinet_fields
# в боевой БД ещё не было: P2022 ColumnNotFound, «exiting the build».
#
# HIGH-5 («сборке не нужен доступ к боевой БД») этим не нарушается сильнее,
# чем уже нарушено: доступ у сборки и так есть, и именно на нём держится
# пререндер контента.
#
# `migrate deploy` идемпотентен, поэтому он остался и в CMD (см. ниже) — это
# страховка на случай отката на старый образ, рестарта без пересборки и
# повторной сборки того же коммита, когда этот слой берётся из кеша BuildKit.
#
# Расплата за такой порядок: если сборка упадёт ПОСЛЕ миграции, схема на проде
# окажется впереди работающего старого контейнера. Поэтому миграции должны
# оставаться обратно совместимыми (добавление колонок и таблиц; переименование
# и удаление — через expand-contract). См. docs/deploy/migrations.md.
RUN ./node_modules/.bin/prisma migrate deploy

RUN npm run build

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
