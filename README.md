# Платформа рецептов

Веб-приложение для создания, редактирования и хранения рецептов. Построено с использованием Next.js, Supabase и Tailwind CSS.

## Функциональность

- Просмотр списка рецептов
- Создание новых рецептов
- Редактирование существующих рецептов
- Удаление рецептов
- Отображение детальной информации о рецепте (ингредиенты, инструкции, время приготовления)

## Технологии

- Next.js 14
- TypeScript
- Supabase (база данных)
- Tailwind CSS
- React

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/albinartess/recipe-platform.git
cd recipe-platform
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` в корневой директории проекта и добавьте следующие переменные окружения:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Запустите приложение в режиме разработки:
```bash
npm run dev
```

5. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## Структура базы данных

Таблица `recipes`:
- id: uuid (primary key)
- title: text
- description: text
- ingredients: jsonb[]
- instructions: jsonb[]
- cooking_time: integer
- servings: integer
- image_url: text
- created_at: timestamp with time zone

## Лицензия

MIT
