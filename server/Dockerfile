# Фаза для бекенду
FROM openjdk:17-jdk-slim AS backend

WORKDIR /ContentFlow

# Копіюємо лише необхідні файли для бекенду
COPY /ContentFlow/ /ContentFlow/

# Додаємо права на виконання для mvnw
RUN chmod +x mvnw

# Будуємо бекенд, пропускаючи тести
RUN ./mvnw clean install -DskipTests

# Остання фаза - для запуску
FROM openjdk:17-jdk-slim

# Копіюємо зібраний JAR для бекенду
COPY --from=backend /ContentFlow/target/*.jar /app.jar

# Відкриваємо порт
EXPOSE 8080

# Запуск бекенду
CMD ["java", "-jar", "/app.jar"]