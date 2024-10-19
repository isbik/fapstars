# README

## [Дока по настройке облачного окруения тут](./docs/README.md)

## Документация (Swagger)

Докумендация к API доступна по адресу `/docs`

## Локальная разработка

1. Настраиваем переменные окружения

```bash
cp .env.example .env
```

! - Не забываем указать `SECRET_TOKEN` и `BOT_TOKEN`

2.1 Поднимаем БД

```bash
docker compose up -d db # БД для сервера
docker compose up -d db_test # БД на которой гоняются тесты
```

2.2 При желании можно и сам бекенд запустить в Docker, тогда проще запустить всё разом через `docker compose up -d`, тогда пункт 3 можно не выполнять

3. Поднимаем dev сервер (при условии без Docker)

```bash
npm run start:dev
```

## Прод сборка

1. Для настройки сервера выполнить команды в ci/setup-server.sh

2. Настраиваем переменные окружения

```bash
cp .env.prod .env
```

Ставим следующие значения

```bash
NODE_ENV=production
HOST=0.0.0.0
SECRET_TOKEN={ваш токен}
```

3. Запускаем контейнеры

```bash
docker compose -f docker-compose.prod.yml up -d
```

4. Запскаем мониторинг если нужно
```bash
docker compose -f monitoring/monitoring.prod.yml up -d
```

## База данных (бекапы)

База данных прокинута через volume в папку `./db_volume` в корне проекта

## Особенности

В качестве аутентификации используется заголовок `X-Token`, представляющей из себя хеш. Проверка расположена в `verifyUser` middleware

Для особо важных запросов рекомендуется закрыть роут через `verifySignature` middleware

## Алгоритм работы

Большинство файлов необходимых для работы можно сгененрировать командой `node ace`

### Миграции

Создаем миграцию командой `node ace make:migration {имя_миграции}`  
Миграции создаются в папке `database/migrations`

### Модель

Создаем модель командой `node ace make:model {имя_модели}`  
Модели создаются в папке `app/models`

## Валидатор

Создаем валидатор командой `node ace make:validator {имя_валидатор}`  
Валидаторы создаются в папке `app/validators`

```ts
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    content: vine.string().trim().nullable(),
  })
)
```

Запрос можно провалидировать используя метод запроса `validateUsing` и передать вадидатор

```ts
async store({ request }: HttpContext) {
  await request.validateUsing(createPostValidator)
  ...
```

Или же можно использовать валидатор напрямую, передав туда произвольный объект, который будет провалидирован

```ts
async index({ request }: HttpContext) {
  await queryPaginationValidator.validate(request.qs())
  ...
```

### Контроллер

Создаем контроллер командой `node ace make:controller {имя_контроллера}`  
Контроллеры создаются в папке `app/controllers`

### Роут

Роуты заводятся в файле `start/routes`

```ts
router
  .group(() => {
    router
      .group(() => {
        router.get('posts', [LeaguesController, 'index']) // листинг всех сущностей
        router.post('posts', [LeaguesController, 'store']) // создание сущности
        router.patch('posts/:id', [LeaguesController, 'update']) // обновление сущности
        router.get('posts/:id', [LeaguesController, 'show']) // получить 1 сущность
        router.delete('posts/:id', [LeaguesController, 'destroy']) // удаление сущности
      })
      .prefix('/v1')
  })
  .prefix('/api')
```
