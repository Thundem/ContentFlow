# Dockerfile для React фронтенду
FROM node:16

# Встановлюємо робочий каталог
WORKDIR /app

# Копіюємо package.json та yarn.lock
COPY package.json .
COPY yarn.lock .

# Встановлюємо залежності
RUN yarn install

# Копіюємо весь код
COPY . .

# Збираємо додаток
RUN yarn build

# Встановлюємо сервіс для сервінгу статичних файлів
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Вказуємо команду для запуску Nginx
CMD ["nginx", "-g", "daemon off;"]