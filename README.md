# L5 Docker HW

Fastify API + Postgres у Docker (multi-stage, compose, healthcheck).

## Запуск

```bash
cp .env.example .env   # паролі лише в runtime compose, не в Dockerfile
```

`POSTGRES_PASSWORD` у `docker-compose.yml` **без дефолта**: без `.env` стек не підніметься, а не поїде зі слабким `app`.

```bash
# локально (автоматично підхопить docker-compose.override.yml):
# bind-mount ./src → /app/src, node --watch, порт 3000
docker compose up --build

# CI / prod-like без override (без портів назовні і без hot-reload).
# У CI немає .env — пароль з secrets store:
POSTGRES_PASSWORD=$SECRET docker compose -f docker-compose.yml up -d --build
```

Перевірка:

```bash
# dev (override пробрасує 3000) — з хоста:
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/users

# CI / prod-like (портів назовні немає — це очікувано) — зсередини контейнера:
docker compose -f docker-compose.yml exec app node -e "fetch('http://127.0.0.1:3000/health').then(async r=>{console.log(await r.text());process.exit(r.ok?0:1)}).catch(e=>{console.error(e);process.exit(1)})"
```

Зупинка: `docker compose down` — volume `pgdata` зберігає дані Postgres.

Код у `src/`, тести в `test/` — у runner їде лише `COPY --from=build /app/src ./src` (WORKDIR образу — `/app`), тож нові роути не треба перелічувати файлами, а `*.test.mjs` у фінальний образ не потрапляють. Схема Postgres лежить у `db/init.sql` окремо від `src/`, тому SQL не потрапляє в прод-образ застосунку.

`db/init.sql` виконується **лише при першій ініціалізації тому**. Якщо змінюєш схему — `docker compose down -v`, інакше здаватиметься, що файл ігнорується.

## Розмір образу: одна стадія vs multi-stage

| Варіант                                         | Тег         | `docker images` |
| ----------------------------------------------- | ----------- | --------------- |
| «В лоб» (одна стадія, повний `npm ci` + vitest) | `l5-single` | **449 MB**      |
| Multi-stage (`AS build` + runner `--omit=dev`)  | `l5-multi`  | **371 MB**      |

**Різниця ≈ −78 MB (−24%):** у фінальний образ не потрапляють `devDependencies` (vitest) і тестові файли — вони лишаються лише в стадії `build`.

```bash
docker build --progress=plain -t l5-multi .
docker images l5-multi
```

## Контекст збірки (`.dockerignore`)

Пара з `docker build --progress=plain` (рядок `transferring context`; кількість файлів — скільки реально їде в контекст).

|       | розмір  | файлів |
| ----- | ------- | ------ |
| До    | 352 kB  | 85     |
| Після | 85.8 kB | 6      |

Без ignore в контекст потрапляють `node_modules` і `.git`. Після — лише `package*.json`, `src/`, `test/`, `db/init.sql`, `.dockerignore`.

## Ендпойнти

| Метод | Шлях      | Опис                   |
| ----- | --------- | ---------------------- |
| GET   | `/health` | liveness               |
| GET   | `/users`  | користувачі з Postgres |
