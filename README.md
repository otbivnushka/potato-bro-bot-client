# Potato Bro Bot Client

![Potato Bro](./src/assets/logo/logo.gif)

Клиентская часть чат-бота на `React + TypeScript + Vite` с desktop-оболочкой на `Electron`.
Проект включает авторизацию, список чатов, потоковую генерацию ответов и пользовательские настройки (тема и персонаж).

## Возможности

- Регистрация и логин с хранением JWT в `localStorage`
- Защищенные роуты (`/` доступен только после авторизации)
- Создание, удаление и поиск чатов
- Потоковый ответ бота через SSE-подобный стрим
- Выбор персонажа и переключение светлой/темной темы
- Адаптивный интерфейс (desktop + mobile sidebar)

## Стек

- `React 19`, `TypeScript`, `Vite`
- `Electron`
- `Tailwind CSS 4`
- `Radix UI`
- `Axios`
- `React Router`

## Быстрый старт

### 1. Требования

- `Node.js` 20+
- `npm` 10+
- Запущенный backend API (по умолчанию `http://localhost:3000`)

### 2. Установка

```bash
npm install
```

### 3. Переменные окружения

Создайте или проверьте файл `.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Команда запускает одновременно:

- dev-сервер Vite (`http://localhost:5173`)
- окно Electron, подключенное к этому dev-серверу

## Скрипты

- `npm run dev` - Vite + Electron для локальной разработки
- `npm run dev-vite` - только Vite dev server
- `npm run build` - production-сборка фронтенда в `dist`
- `npm run build-vite` - проверка TypeScript (`tsc -b`) + Vite build
- `npm run preview` - локальный просмотр production-сборки
- `npm run lint` - проверка ESLint

## Структура проекта

```text
src/
  app/          UI, страницы и компоненты
  hooks/        auth и стриминг сообщений
  services/     API-клиент, DTO, бизнес-методы
  styles/       глобальные стили и тема
electron/
  main.ts       точка входа Electron
```

## Как работает API-интеграция

- Основной REST API берется из `VITE_API_URL`
- JWT автоматически добавляется в `Authorization` через `axios` interceptor
- Чаты, сообщения и настройки имеют локальное кэширование в сервисах

Важно: поток сообщений сейчас отправляется на фиксированный URL `http://localhost:3000/messages/stream` (в `use-stream-message.tsx`), независимо от `VITE_API_URL`.

## Статус

Учебный клиент для проекта "Potato Bro Bot". Подходит как основа для дальнейшей доработки desktop/web интерфейса.
