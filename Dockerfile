# Фаза для бекенду
FROM openjdk:17-jdk-slim AS backend

WORKDIR /app/ContentFlow

# Копіюємо лише необхідні файли для бекенду
COPY server/ContentFlow/ /app/ContentFlow/

# Додаємо права на виконання для mvnw
RUN chmod +x mvnw

# Будуємо бекенд, пропускаючи тести
RUN ./mvnw clean install -DskipTests

# Фаза для фронтенду
FROM node:16 AS frontend

WORKDIR /app

# Копіюємо файли клієнта та будуємо
COPY client/ /app/
RUN npm install && npm run build

# Остання фаза - для запуску з Nginx
FROM nginx:alpine

# Копіюємо фронтенд
COPY --from=frontend /app/dist /usr/share/nginx/html

# Копіюємо зібраний JAR для бекенду
COPY --from=backend /app/ContentFlow/target/*.jar /app.jar

# Відкриваємо порти
EXPOSE 8080 80

# Запуск обох частин (бекенд та фронтенд)
CMD ["sh", "-c", "java -jar /app.jar & nginx -g 'daemon off;'"]