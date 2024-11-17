#!/bin/bash

# Запуск Java додатку у фоновому режимі
java -jar /app.jar &

# Запуск Nginx
nginx -g "daemon off;"