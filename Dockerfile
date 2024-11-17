# Фаза для бекенду
FROM openjdk:17-jdk-slim AS backend

WORKDIR /app/ContentFlow

COPY server/ContentFlow/ /app/ContentFlow/

RUN chmod +x mvnw

RUN ./mvnw clean install -DskipTests

# Фаза для фронтенду
FROM node:16 AS frontend

WORKDIR /app

# Копіюємо тільки файли package.json та package-lock.json для кращого кешування
COPY client/package*.json ./

# Очищення попередніх залежностей, якщо такі існують
RUN rm -rf node_modules

# Очищення кешу npm перед встановленням
RUN npm cache clean --force

# Встановлення залежностей
RUN npm install

# Копіюємо решту файлів фронтенду
COPY client/ ./

# Побудова фронтенду
RUN npm run build

# Очищення node_modules та кешу після побудови для зменшення розміру образу
RUN rm -rf node_modules && npm cache clean --force

# Фінальний образ, базований на openjdk:17-jdk-slim
FROM openjdk:17-jdk-slim

# Встановлення змінної середовища для безінтерактивної установки
ENV DEBIAN_FRONTEND=noninteractive

# Встановлення Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Копіюємо зібраний фронтенд
COPY --from=frontend /app/dist /usr/share/nginx/html

# Копіюємо nginx конфігурацію
COPY nginx.conf /etc/nginx/sites-available/default

# Копіюємо зібраний JAR для бекенду
COPY --from=backend /app/ContentFlow/target/*.jar /app.jar

# Копіюємо shell-скрипт запуску
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Відкриваємо порти
EXPOSE 80 8080

# Запуск скрипту
CMD ["/start.sh"]