# ContentFlow

ContentFlow — це потужний веб-сервіс для ведення блогу, який дозволяє користувачам створювати пости, додавати коментарі та лайки, а також керувати своїм контентом через зручний інтерфейс. Система побудована на основі Spring Boot, з використанням PostgreSQL для зберігання даних та інших сучасних технологій для досягнення високої продуктивності та масштабованості.

## Особливості

- Створення, перегляд, оновлення та видалення постів.
- Додавання, редагування та видалення коментарів до постів.
- Лайки постів, з обмеженням на один лайк від користувача.
- Реєстрація та авторизація користувачів з можливістю управління профілем.
- Адаптивний дизайн для зручного використання на різних пристроях.
- Підтримка REST API для інтеграції з іншими сервісами.

## Технології

- **Java** — мова програмування для розробки сервісу.
- **Spring Boot** — основний фреймворк для побудови веб-застосунків.
- **PostgreSQL** — система керування базами даних для зберігання даних користувачів та контенту.
- **Lombok** — бібліотека для скорочення шаблонного коду в Java.
- **Maven** — інструмент для керування залежностями та збору проекту.
- **Docker** — для контейнеризації та спрощення розгортання.
- **TypeScript** — мова програмування для розробки фронтенду.
- **React** — бібліотека для створення інтерфейсів користувача.
- **Vite** — інструмент для швидкої зборки фронтенд-проектів.
- **Axios** — бібліотека для роботи з HTTP запитами на клієнтській частині.

## Структура проекту

### Серверна частина

```
ContentFlow/
│
├── client/                          # Клієнтська частина проекту
│   ├── public                       # Публічні файли (ці файли доступні для веб-браузера)
│   │   ├── icons                    # Папка для іконок, які використовуються в проєкті
│   │   ├── manifest.json            # Файл налаштувань прогресивного веб-додатку (PWA)
│   │   └── vite.svg                 # Логотип або зображення, використовуване для Vite
│   └── src                          # Джерельні файли проєкту
│       ├── api                       # Папка для API запитів (наприклад, для комунікації з сервером)
│       ├── assets                    # Папка для статичних активів (зображення, шрифти, тощо)
│       ├── components                # Папка для React компонент
│       │   ├── img                   # Папка для зображень, які використовуються в компонентах
│       │   ├── style                 # Папка для стилів компонентів (CSS/SCSS файли)
│       ├── context                   # Папка для глобального стану та контекстів
│       ├── hooks                     # Папка для власних React хук
│       ├── providers                 # Папка для провайдерів контекстів чи глобальних сервісів
│       ├── App.css                   # Стилі для основного додатку
│       ├── App.tsx                   # Головний компонент додатку
│       ├── index.css                 # Глобальні стилі для проекту
│       ├── main.tsx                  # Вхідний файл для React додатку
│       ├── vite-env.d.ts             # Типи для Vite
│       ├── vite.config.ts            # Налаштування для Vite
│       ├── tsconfig.app.json         # Типи для додатку
│       ├── tsconfig.json             # Основні налаштування TypeScript
│       ├── tsconfig.node.json        # Налаштування для Node.js
│       ├── package.json              # Залежності проєкту та скрипти
│       ├── package-lock.json         # Заморожені версії залежностей
│       └── eslint.config.js          # Налаштування для ESLint
│
├── server/                          # Серверна частина проекту
│   └── ContentFlow
│       ├── .idea                    # Налаштування середовища розробки (наприклад, для JetBrains)
│       ├── .mvn                     # Папка для Maven конфігурацій
│       ├── src                       # Джерельні файли серверної частини
│       │   ├── main
│       │   │   ├── java
│       │   │   │    ├── com
│       │   │   │    │    └── coursework
│       │   │   │    │        └── ContentFlow
│       │   │   │    │            ├── configurations            # Конфігурації серверної частини
│       │   │   │    │            ├── controllers               # Контролери для обробки запитів
│       │   │   │    │            ├── DTOs                       # Об'єкти передачі даних (Data Transfer Objects)
│       │   │   │    │            ├── handlers                   # Обробники запитів та винятків
│       │   │   │    │            ├── models                     # Моделі для бази даних
│       │   │   │    │            ├── repositories               # Репозиторії для взаємодії з базою даних
│       │   │   │    │            ├── services                   # Сервіси для логіки проєкту
│       │   │   │    │            └── ContentFlowApplication.java # Головний клас для запуску серверної частини
│       │   │   │    ├── resources                 # Ресурси сервера (наприклад, конфігураційні файли)
│       │   │   │    └── application.properties  # Конфігурації для Spring Boot
│       │   │   └── test          # Тести для серверної частини
│       │   ├── .gitignore            # Ігноруємо файли для Git
│       │   ├── mvnw                  # Скрипти для запуску Maven
│       │   ├── mvnw.cmd              # Скрипт для Windows для запуску Maven
│       │   └── pom.xml               # Основний файл конфігурації для Maven
│       │
│       ├── Dockerfile            # Налаштування Docker для серверної частини
│       
└── docker-compose.yml            # Файл для налаштування Docker Compose, розташований в корені проєкту
```

## Встановлення

1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/your-username/ContentFlow.git
   ```

2. Перейдіть до папки з проектом:
   ```bash
   cd ContentFlow
   ```

3. Запустіть серверний додаток:
   - Перейдіть до папки `server` і побудуйте проект за допомогою Maven:
     ```bash
     mvn clean install
     ```
   - Запустіть сервер:
     ```bash
     mvn spring-boot:run
     ```

4. Запустіть клієнтську частину проекту:
   - Перейдіть до папки `client` і запустіть фронтенд:
     ```bash
     npm install
     npm start
     ```

5. Для запуску проекту з Docker, використовуйте:
   ```bash
   docker-compose up
   ```

6. Перевірте роботу додатку, відкривши браузер за адресою `http://localhost:5137`.

## Ліцензія

Цей проект ліцензовано за умовами ліцензії MIT.