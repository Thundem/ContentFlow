# Базовий образ для Node.js
FROM node:16 AS build

WORKDIR /app

# Копіюємо лише package.json та package-lock.json для кешування залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо інші файли проєкту
COPY . ./

# Будуємо проєкт
RUN npm run build

# Фінальний образ для Nginx
FROM nginx:stable-alpine

# Копіюємо зібрані файли у стандартну папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копіюємо конфігураційний файл Nginx з кореневої папки
COPY ../nginx.conf /etc/nginx/conf.d/default.conf

# Відкриваємо порт для фронтенду
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
