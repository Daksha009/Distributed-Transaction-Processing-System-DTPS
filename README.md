# Distributed Transaction Processing System (DTPS)

A high-performance, resilient distributed transaction processing system built with Java (Spring Boot), Docker, and Kubernetes. The system is designed to handle financial transactions with fault tolerance (Circuit Breaker) and scalable storage integration (S3).

## 🚀 Key Features

*   **Core Transaction Processing**: REST API for creating and retrieving transactions.
*   **Resilience**: Circuit Breaker pattern (Resilience4j) to handle downstream failures gracefully.
*   **Storage Integration**: Automatic receipt generation and upload to AWS S3.
*   **Monitoring**: Health checks and metrics exposed via Spring Boot Actuator.
*   **Containerization**: Optimized multi-stage Docker build using Google Distroless images for security.
*   **Orchestration**: Kubernetes manifests for Deployment, Service, and Horizontal Pod Autoscaling (HPA).

## 🛠️ Tech Stack

*   **Language**: Java 21 (LTS)
*   **Framework**: Spring Boot 3.3.0
*   **Build Tool**: Maven
*   **Database**: H2 (In-memory for Dev), PostgreSQL (Production ready)
*   **Cloud Storage**: AWS S3 (via AWS SDK 2.x)
*   **Container Runtime**: Docker
*   **Orchestration**: Kubernetes (EKS compatible)

---

## 📋 Prerequisites

Ensure you have the following installed:

1.  **Java 21 JDK**: [Download](https://adoptium.net/)
2.  **Maven 3.9+**: [Download](https://maven.apache.org/download.cgi)
3.  **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop/)

---

## 🏃‍♂️ Getting Started

### 1. Local Setup

Clone the repository and build the project:

```bash
git clone <repository-url>
cd "Internship Assignment"
mvn clean package
```

Run the application:

```bash
java -jar backend/target/dtps-service-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`.

### 2. Docker Setup

Build the Docker image:

```bash
docker build -t dtps-service:latest -f Dockerfile .
```

Run the container:

```bash
docker run -p 8080:8080 dtps-service:latest
```

### 3. Kubernetes Deployment

Ensure you have a running K8s cluster (Minikube, EKS, etc.) and `kubectl` configured.

Apply the manifests:

```bash
kubectl apply -f k8s-manifest.yaml
```

Check the status:

```bash
kubectl get pods
kubectl get service dtps-service
```

---

## 🔌 API Documentation

### Create Transaction

*   **URL**: `/api/tx`
*   **Method**: `POST`
*   **Body**:

```json
{
  "sender": "Alice",
  "receiver": "Bob",
  "amount": 150.00
}
```

### Health Check

*   **URL**: `/api/health`
*   **Method**: `GET`
*   **Response**: Returns system metrics and status.

---

## 🚧 Roadmap & Improvements

The current implementation is a solid MVP. To make this **Production Ready**, the following improvements are recommended:

### 1. Configuration Management (`application.properties`)
*   **Current State**: Uses in-memory H2 database and placeholder S3 bucket names.
*   **Improvement**: Update `application.properties` to separate `dev` and `prod` profiles.
    *   **Prod Profile**: Configure PostgreSQL connection strings and environmental variable injection for AWS Credentials.

### 2. Security Hardening
*   **Current State**: Basic setups in `provision.sh` and Kubernetes manifests.
*   **Improvement**:
    *   **IAM Roles**: Replace placeholder ARN in `k8s-manifest.yaml` with a real AWS IAM Role for Service Accounts (IRSA) to grant S3 access securely.
    *   **Secrets**: Move sensitive configuration (DB passwords) to Kubernetes Secrets or AWS Secrets Manager.

### 3. CI/CD Pipeline
*   **Current State**: Manual build instructions.
*   **Improvement**: Add a GitHub Actions workflow or Jenkins pipeline to:
    *   Run tests (`mvn test`).
    *   Build and push the Docker image to ECR/DockerHub.
    *   Deploy to the Kubernetes cluster automatically.

### 4. Database Persistence
*   **Current State**: Transactions are lost when the application restarts (H2 In-Memory).
*   **Improvement**: Provision an external PostgreSQL database (AWS RDS) so transaction data persists across deployments.
