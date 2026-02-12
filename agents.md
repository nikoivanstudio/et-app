# Codex Configuration - agents.md

## 1. Цели использования Codex

- Генерация кода и тестов (для утилит, функций и компонентов).
- Помощь в решении багов и диагностике ошибок.
- Интеграция с TypeScript, ESLint и Prettier для детектирования и исправления ошибок.

## 2. Структура проекта

- Использование архитектуры Feature-Sliced Design (FSD).
- Разделение бизнес-логики и разметки через кастомные хуки, API хелперы и утилиты.
- Использование shadcn/ui и tailwind/css для переиспользуемых компонентов в `src/shared/ui`.

## 3. Типы тестов

- Покрытие тестами для утилит, функций и компонентов.
- компонентные тесты пишем на технологиях React Testing Library и Vitest. Один тест — один сценарий.
- Переход к написанию E2E тестов с использованием cucumber/playwright.

## 4. Типизация и код-стайл

- Строгая типизация с TypeScript. Никогда не пишем. any
- Проверка стиля кода с помощью ESLint и Prettier.
- Следование принципам "чистого кода" Роберта Мартина (функции, декораторы, семантические названия).

## 5. Роль Codex

- Помощь в код-ревью, проверка стиля и структуры кода.
- Интеграция с инструментами для статики и линтинга (TypeScript, ESLint, Prettier).
- Генерация документации и помощь в отладке.
## 6. Component Testing Standard (Locked)

Single source of truth for component testing rules:

- `docs/component-testing-standard.md`

## 7. API Unit Testing Standard (Locked)

Single source of truth for API route unit testing rules:

- `docs/component-testing-standard.md#api-unit-testing-standard-locked`
- Prompt template for future API unit tests:
- `docs/component-testing-standard.md#api-prompt-template`
