# Build Stage
FROM ubuntu:22.04 AS build
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y software-properties-common curl wget
RUN add-apt-repository ppa:openjdk-r/ppa -y && apt-get update
RUN apt-get install -y openjdk-21-jdk maven

WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:openjdk-r/ppa -y && apt-get update
RUN apt-get install -y openjdk-21-jdk

# Create non-privileged user
RUN useradd -m -s /bin/bash dtps-user
USER dtps-user
WORKDIR /app
COPY --from=build /app/target/dtps-service-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
