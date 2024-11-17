# Фаза для фронтенду
FROM node:16 AS frontend

WORKDIR /app

# Копіюємо файли клієнта та будуємо
COPY . /app/
RUN npm install && npm run build

# Остання фаза - для запуску з Nginx
FROM nginx:alpine

# Копіюємо фронтенд
COPY --from=frontend /app/dist /usr/share/nginx/html

# Відкриваємо порт
EXPOSE 80

# Запуск фронтенду
CMD ["nginx", "-g", "daemon off;"]