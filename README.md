
# ContentFlow

ContentFlow - це веб-сервіс для ведення блогу, який дозволяє користувачам створювати пости, додавати коментарі та лайки. Сервіс побудований на основі Spring Boot і використовує PostgreSQL для зберігання даних.

## Особливості

- Створення, отримання та видалення постів.
- Додавання коментарів до постів.
- Лайки постів, з обмеженням на один лайк від користувача.
- Користувацька реєстрація та управління користувачами.

## Технології

- Java
- Spring Boot
- PostgreSQL
- Lombok
- Maven

## Структура проекту

```
ContentFlow
│
├── /server (Spring Boot проект)
│   ├── /src
│   │   ├── /main
│   │   │   ├── /java
│   │   │   │   └── com.coursework.ContentFlow
│   │   │   │       ├── /controllers
│   │   │   │       ├── /models
│   │   │   │       ├── /services
│   │   │   │       ├── /repositories
│   │   │   └── /resources
│   │   ├── pom.xml
```

## Встановлення

1. Клонуйте репозиторій:

   ```bash
   git clone https://github.com/yourusername/contentflow.git
   ```

2. Перейдіть до папки проекту:

   ```bash
   cd contentflow
   ```

3. Налаштуйте базу даних PostgreSQL. Створіть базу даних з ім'ям `contentflow`.

4. Налаштуйте файл `application.properties` для вашої бази даних:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/contentflow
   spring.datasource.username=yourusername
   spring.datasource.password=yourpassword
   ```

5. Запустіть проект:

   ```bash
   ./mvnw spring-boot:run
   ```

## Використання

- **Реєстрація користувача:**
  - `POST /api/users/register`
  - Тіло запиту:
    ```json
    {
        "username": "yourusername",
        "password": "yourpassword"
    }
    ```

- **Отримати всіх користувачів:**
  - `GET /api/users`

- **Створення поста:**
  - `POST /api/posts?userId={userId}`
  - Тіло запиту:
    ```json
    {
        "title": "Назва поста",
        "content": "Зміст поста"
    }
    ```

- **Отримати всі пости:**
  - `GET /api/posts`

- **Додати лайк до поста:**
  - `POST /api/posts/{postId}/like?userId={userId}`

- **Додати коментар до поста:**
  - `POST /api/posts/{postId}/comments?userId={userId}`
  - Тіло запиту:
    ```json
    {
        "text": "Це мій коментар"
    }
    ```

## Відомі проблеми

- Зациклення у JSON-відповіді при наявності зайвих зв'язків між моделями.
- Неправильне форматування імен полів у JSON-відповіді.

## Ліцензія

Цей проект ліцензований під ліцензією MIT. Дивіться файл [LICENSE](LICENSE) для деталей.
