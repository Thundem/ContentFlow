# ContentFlow

ContentFlow — це веб-сервіс для ведення блогу, який дозволяє користувачам створювати пости, додавати коментарі та лайки, а також керувати своїм контентом через зручний інтерфейс. Система побудована на основі Spring Boot для бекенд-частини та React з TypeScript для фронтенду. Для зберігання даних використовується PostgreSQL, що забезпечує високу продуктивність і масштабованість. Використання сучасних технологій дозволяє досягти ефективної інтеграції та зручності у роботі з додатком.

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
│   ├── public                       # Публічні файли (доступні для веб-браузера)
│   │   ├── icons                    # Іконки, що використовуються у проєкті
│   │   ├── manifest.json            # Файл для налаштувань PWA (прогресивного веб-додатку)
│   │   └── vite.svg                 # Зображення або логотип для Vite
│   └── src                          # Джерельні файли клієнтської частини
│       ├── api                      # API-запити до серверної частини
│       ├── assets                   # Статичні активи (зображення, шрифти тощо)
│       ├── components               # React-компоненти
│       │   ├── img                  # Зображення, що використовуються у компонентах
│       │   ├── style                # Стилі для компонентів (CSS/SCSS)
│       ├── context                  # Глобальний стан і контексти
│       ├── hooks                    # Власні React-хуки
│       ├── providers                # Провайдери контекстів та сервісів
│       ├── App.css                  # Стилі для головного компонента додатку
│       ├── App.tsx                  # Головний компонент клієнтської частини
│       ├── index.css                # Глобальні стилі для додатку
│       ├── main.tsx                 # Вхідний файл для React-додатку
│       ├── vite-env.d.ts            # Типи, специфічні для Vite
│       ├── vite.config.ts           # Налаштування Vite
│       ├── tsconfig.app.json        # Налаштування TypeScript для додатку
│       ├── tsconfig.json            # Основний файл налаштувань TypeScript
│       ├── tsconfig.node.json       # Налаштування TypeScript для Node.js
│       ├── package.json             # Залежності клієнтської частини та скрипти
│       ├── package-lock.json        # Заморожені версії залежностей
│       ├── Dockerfile               # Налаштування для Docker образу клієнтської частини
│       └── eslint.config.js         # Налаштування ESLint для перевірки коду
│
├── server/                          # Серверна частина проекту
│   └── ContentFlow
│       ├── .idea                    # Налаштування середовища розробки (наприклад, IntelliJ IDEA)
│       ├── .mvn                     # Конфігураційні файли Maven
│       ├── src                      # Джерельні файли серверної частини
│       │   ├── main
│       │   │   ├── java
│       │   │   │    ├── com
│       │   │   │    │    └── coursework
│       │   │   │    │        └── ContentFlow
│       │   │   │    │            ├── configurations            # Конфігурації (налаштування) для сервера
│       │   │   │    │            ├── controllers               # Контролери для обробки HTTP-запитів
│       │   │   │    │            ├── DTOs                      # Об'єкти передачі даних
│       │   │   │    │            ├── handlers                  # Обробники винятків і запитів
│       │   │   │    │            ├── models                    # Моделі для взаємодії з базою даних
│       │   │   │    │            ├── repositories              # Репозиторії для доступу до бази даних
│       │   │   │    │            ├── services                  # Логіка додатку
│       │   │   │    │            └── ContentFlowApplication.java # Головний клас для запуску сервера
│       │   │   ├── resources        # Ресурси серверної частини
│       │   │   └── application.properties # Файл конфігурацій для Spring Boot
│       │   └── test                 # Тести для серверної частини
│       ├── .gitignore               # Файл для ігнорування зайвих файлів у Git
│       ├── mvnw                     # Скрипт для запуску Maven
│       ├── mvnw.cmd                 # Windows-версія скрипта для Maven
|       ├── Dockerfile               # Налаштування для Docker образу серверної частини
│       └── pom.xml                  # Основний файл конфігурацій Maven
│
├── docker-compose.yml               # Файл для керування контейнерами за допомогою Docker Compose
├── Dockerfile                       # Єдиний Dockerfile для збирання фронтенду, бекенду та запуску Nginx
├── nginx.conf                       # Конфігурація Nginx для проксірування та обслуговування статичних файлів
└── start.sh                         # Скрипт запуску Java-додатку і Nginx
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

Цей проект ліцензований під ліцензією MIT. Дивіться файл [LICENSE](LICENSE) для деталей.
