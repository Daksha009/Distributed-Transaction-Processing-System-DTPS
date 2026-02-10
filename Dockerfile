# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
# Using Google Distroless for security (contains only Java and runtime dependencies)
FROM gcr.io/distroless/java21-debian12
WORKDIR /app
COPY --from=build /app/target/dtps-service-0.0.1-SNAPSHOT.jar app.jar

# Run as non-root user (Distroless 'nonroot' user)
USER nonroot:nonroot

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
