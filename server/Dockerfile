# Базовий образ для Java
FROM openjdk:17-jdk-slim

WORKDIR /app

# Копіюємо всі файли серверної частини
COPY . .

# Додаємо права на виконання для Maven Wrapper
RUN chmod +x mvnw

# Збираємо серверну частину
RUN ./mvnw clean install -DskipTests

# Копіюємо зібраний JAR файл
COPY target/*.jar app.jar

# Відкриваємо порт для серверної частини
EXPOSE 8080

# Запуск JAR
CMD ["java", "-jar", "app.jar"]
