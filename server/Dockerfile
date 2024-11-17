# Використовуємо Oracle OpenJDK 17
FROM oraclelinux:8

# Додаємо репозиторій OpenJDK 17
RUN dnf install -y oracle-epel-release-el8 \
    && dnf config-manager --enable ol8_codeready_builder \
    && dnf install -y java-17-openjdk-devel

# Встановлюємо робочий каталог
WORKDIR /app

# Копіюємо pom.xml та код
COPY pom.xml .
COPY src ./src

# Встановлюємо Maven (якщо потрібно) і збираємо програму
RUN curl -fsSL https://downloads.apache.org/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.tar.gz | tar -xz -C /opt \
    && ln -s /opt/apache-maven-3.8.8/bin/mvn /usr/bin/mvn \
    && mvn clean package -DskipTests

# Копіюємо зібраний .jar файл
COPY target/*.jar app.jar

# Команда для запуску програми
CMD ["java", "-jar", "app.jar"]
