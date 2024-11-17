# Фаза для бекенду
FROM openjdk:17-jdk-slim AS backend

WORKDIR /app/ContentFlow

COPY server/ContentFlow/ /app/ContentFlow/

RUN chmod +x mvnw

RUN ./mvnw clean install -DskipTests

# Фаза для фронтенду
FROM node:16 AS frontend

WORKDIR /app

COPY client/ /app/
RUN npm install && npm run build

# Фінальний образ, базований на openjdk:17-jdk-slim
FROM openjdk:17-jdk-slim

# Встановлення Nginx та Supervisord
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# Копіюємо зібраний фронтенд
COPY --from=frontend /app/dist /usr/share/nginx/html

# Копіюємо nginx конфігурацію
COPY nginx.conf /etc/nginx/sites-available/default

# Копіюємо зібраний JAR для бекенду
COPY --from=backend /app/ContentFlow/target/*.jar /app.jar

# Копіюємо supervisord конфігурацію
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Відкриваємо порти
EXPOSE 80 8080

# Запуск supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]