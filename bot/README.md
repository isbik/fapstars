# Описание

Это репозиторий является микросервисом для запуска бота

## Запуск

```bash
git clone {repo_url}
cd bot
npm i
cp .env.example .env
nano .env # прописыаем переменные окружения
node index.js
```

Для dev сборки запусск удобнее проводить через `nodemon`

## Реферальная сисмема

Реферальная ссылка выглядит следующим образом:

```bash
https://t.me/{bot_name}?start=ref{telegram_username}
# Например https://t.me/FapStarsBot?start=refalometov
```
