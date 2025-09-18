# Stage 1: Build backend application with Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy all necessary project files
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .gitignore .
COPY keystore.p12 .
COPY selfsigned.crt .
COPY qodana.yaml .
COPY src ./src

# Build the application JAR
RUN mvn clean package -DskipTests

# Stage 2: Final runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the application JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Copy the keystore for SSL
COPY --from=builder /app/keystore.p12 keystore.p12

EXPOSE 8443
ENTRYPOINT ["java", "-jar", "app.jar"]