# Dockerfile для Java бекенду
FROM openjdk:11-jdk-slim

# Встановлюємо робочий каталог
WORKDIR /app

# Копіюємо pom.xml та інші залежності
COPY pom.xml .
COPY src ./src

# Встановлюємо залежності та компілюємо
RUN ./mvnw clean package

# Копіюємо зібрану програму
COPY target/*.jar app.jar

# Вказуємо команду для запуску
CMD ["java", "-jar", "app.jar"]