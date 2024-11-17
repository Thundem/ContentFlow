#!/bin/bash

# Запуск Java додатку у фоновому режимі
java -jar /app.jar &

# Перевірка, чи Java додаток запустився успішно
if [ $? -ne 0 ]; then
  echo "Failed to start Java application"
  exit 1
fi

# Запуск Nginx
nginx -g "daemon off;"