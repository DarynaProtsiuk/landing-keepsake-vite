# Keepsake — landing (Vite + Pug + SCSS)

Лендінг цифрової та брендингової агенції Keepsake. Той самий макет, що й у лабораторній №7, але
зібраний сучасним робочим процесом: Pug → HTML, модульний SCSS → CSS, PostCSS (Autoprefixer),
адаптивні зображення AVIF/WebP/JPEG, Prettier + Stylelint + Git hooks.

**Демо:** https://darynaprotsiuk.github.io/landing-keepsake-vite/

## Вимоги до середовища

- Node.js LTS **20 або новіша** (`node -v`), npm (`npm -v`)

## Команди

| Команда           | Що робить                                                            |
| ----------------- | -------------------------------------------------------------------- |
| `npm install`     | встановлює залежності (і вмикає Git hooks через `prepare`)           |
| `npm run dev`     | dev-сервер Vite з гарячим оновленням                                 |
| `npm run build`   | продакшн-збірка в `dist/` (мініфікований CSS, хешовані імена файлів) |
| `npm run preview` | локальний перегляд зібраної версії                                   |
| `npm run images`  | генерує AVIF/WebP/JPEG у кількох ширинах з `images-source/`          |
| `npm run format`  | форматує весь проєкт Prettier                                        |
| `npm run lint`    | Stylelint для `src/**/*.scss` + `prettier --check .`                 |

## Структура проєкту

```
landing-keepsake-vite/
├── .husky/                  # pre-commit (lint-staged), commit-msg (commitlint)
├── .github/workflows/       # deploy.yml — публікація на GitHub Pages
├── images-source/           # вихідні зображення (work-*.jpg, journal-*.jpg)
├── scripts/images.js        # sharp: вихідні зображення → AVIF / WebP / JPEG
├── src/
│   ├── assets/images/       # результат npm run images (400w/800w і 150w/300w)
│   ├── components/          # header.pug, footer.pug, sections/*.pug
│   ├── data/                # дані секцій (масиви об'єктів)
│   ├── includes/            # meta, fonts
│   ├── layouts/main.pug     # базовий макет з блоками
│   ├── mixins/              # Pug-міксини
│   ├── pages/index.pug      # сторінка (extends макета)
│   └── styles/
│       ├── abstracts/       # токени, брейкпоінти + mq, rem(), міксини
│       ├── base/            # :root (custom properties), reset, утиліти
│       ├── layout/          # container, section, header, footer
│       ├── components/      # один БЕМ-блок — один файл
│       └── main.scss        # єдина точка входу
├── .browserslistrc  .editorconfig  .prettierrc  .prettierignore
├── .stylelintrc.json  .lintstagedrc.json  commitlint.config.js
├── postcss.config.js  vite.config.js  package.json  package-lock.json
```

## Архітектура Pug

- `layouts/main.pug` містить блоки `meta`, `title`, `styles`, `data`, `header`, `content`, `footer`,
  `scripts`. Сторінка `pages/index.pug` робить `extends` і перевизначає їх.
- `append meta` додає description / Open Graph до `meta` макета, не замінюючи charset і viewport;
  `prepend styles` ставить шрифти (preconnect + preload) перед основним файлом стилів.
- Шапка, футер і кожна секція — окремі файли, що підключаються через `include`.
- Дані (навігація, фільтри, роботи, послуги, статистика, клієнти, журнал, футер, соцмережі) лежать у
  `src/data/*.pug` як масиви об'єктів і виводяться через `each` (з індексом там, де він потрібен).
- Міксини (`src/mixins/`): `+btn` (`block` + `&attributes`, `case` для варіанта), `+icon` (`case` для
  вибору SVG), `+picture` (адаптивне зображення), `+work-card`, `+post-card`, `+socials`,
  `+section-heading` (`block` для підзаголовка).
- Умови: `loading="lazy"` для всього нижче першого екрана, `aria-current` та клас
  `nav__link--active` для активного пункту, необов'язкові атрибути.
- Службові коментарі пишуться як `//-` і не потрапляють у HTML.

## Архітектура SCSS

- Лише `@use` / `@forward`; кожна папка має `_index.scss`, який реекспортує partials.
- Токени (кольори, шрифти, відступи, адаптивні значення макета) — map-и в `abstracts/_tokens.scss`.
  `base/_root.scss` через `@each` генерує з них CSS custom properties (`--color-accent`, `--space-4`,
  `--gutter` …), а в компонентах використовується `var(…)`.
- Mobile first: міксин `mq($name)` бере значення з map-а `$breakpoints` і використовує лише `min-width`.
- Функція `rem($px)` (`sass:math`), міксини `font`, `caps`, `visually-hidden`, `flex-center`,
  `focus-ring($color, $offset)`, `button-reset`, `smooth`, `accent-line`, `column-item`.
- БЕМ: `&__element`, `&--modifier`, стани через `&:hover`, `&:focus-visible`; вкладеність ≤ 3, без `id`
  у селекторах і без `!important`. Вендорних префіксів у коді немає — їх додає Autoprefixer.
- Фільтр портфоліо працює без JS: радіокнопки `.filter--<категорія>` + `:checked ~`.

## Використані інструменти

| Інструмент                                   | Навіщо                                                       |
| -------------------------------------------- | ------------------------------------------------------------ |
| Vite 8                                       | dev-сервер і збірка                                          |
| Vituum + `@vituum/vite-plugin-pug`           | генерація HTML з Pug у Vite                                  |
| Sass (Dart Sass)                             | препроцесор стилів                                           |
| PostCSS + Autoprefixer                       | вендорні префікси за списком Browserslist                    |
| sharp                                        | конвертація зображень у AVIF / WebP / JPEG і зміна розмірів  |
| Prettier + `@prettier/plugin-pug`            | єдине форматування (включно з `.pug`)                        |
| Stylelint + `stylelint-config-standard-scss` | перевірка SCSS, БЕМ-шаблон для класів, обмеження вкладеності |
| husky + lint-staged                          | pre-commit: перевірка й форматування лише змінених файлів    |
| commitlint (Conventional Commits)            | перевірка повідомлень комітів                                |
| GitHub Actions                               | `npm ci` → `npm run lint` → `npm run build` → GitHub Pages   |

Усе, що потрібне лише для збирання, лежить у `devDependencies`: на продакшні віддається статичний
`dist/`, Node-залежності там не виконуються.

## Цільові браузери (Browserslist)

`.browserslistrc`: останні 2 версії Chrome, Firefox, Edge, Safari та iOS Safari.
Переглянути список: `npx browserslist`; які властивості префіксує Autoprefixer: `npx autoprefixer --info`.

## Оптимізація: до / після

> Заповніть реальними значеннями після `npm run build` (див. команди під таблицею).

| Що                                             | До                         | Після                           |
| ---------------------------------------------- | -------------------------- | ------------------------------- |
| CSS (lab-07 `style.css` → `dist/assets/*.css`) | 29 129 B (без мініфікації) | _виміряти_ (мініфікований Vite) |
| Зображення робіт (9 шт.)                       | _виміряти_ (WebP lab-07)   | _виміряти_ (AVIF 400w/800w)     |
| Зображення журналу (4 шт.)                     | _виміряти_ (WebP lab-07)   | _виміряти_ (AVIF 150w/300w)     |

```bash
ls -l dist/assets/*.css      # розмір CSS
du -ch dist/assets/*.avif    # сума AVIF
du -ch dist/assets/*.jpg     # сума JPEG-запасних
```

## Публікація

Push у `main` запускає `.github/workflows/deploy.yml`. У `vite.config.js` для збірки задано
`base: '/landing-keepsake-vite/'`, інакше стилі й зображення на GitHub Pages не завантажаться.
Увімкнути: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
