# Этап 1: Сборка приложения с помощью Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только то, что нужно для сборки, чтобы кэш Docker работал эффективнее
COPY pom.xml .
COPY src ./src

# Собираем jar-файл, пропуская тесты
RUN mvn clean package -DskipTests

# Этап 2: Создание финального образа для запуска
FROM eclipse-temurin:21-jre
WORKDIR /app

# Копируем только собранный jar-файл из предыдущего этапа
COPY --from=builder /app/target/*.jar app.jar

# Указываем, что контейнер будет слушать порт 8080
EXPOSE 8080

# Команда для запуска приложения
ENTRYPOINT ["java", "-jar", "app.jar"]