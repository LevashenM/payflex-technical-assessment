# PaymentOrchestrator Docker Setup

This document provides comprehensive instructions for running the PaymentOrchestrator application using Docker and Docker Compose.

## 🐳 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Docker Compose                         │
├─────────────────┬─────────────────┬─────────────────┬──────────┤
│   Frontend      │    Backend      │   Database      │ pgAdmin  │
│   (React/Nginx) │  (.NET 8 API)   │  (PostgreSQL)   │ (Web UI) │
│   Port: 3000    │   Port: 8080    │   Port: 5432    │Port: 8081│
└─────────────────┴─────────────────┴─────────────────┴──────────┘
```

## 🏗️ Docker Components

### 1. Backend Container
- **Base Image**: `mcr.microsoft.com/dotnet/aspnet:8.0`
- **Build Context**: `./backend`
- **Exposed Port**: `8080`
- **Database**: PostgreSQL with automatic migrations
- **Health Check**: `/health` endpoint

### 2. Frontend Container
- **Base Image**: `nginx:alpine`
- **Build Context**: `./frontend`
- **Exposed Port**: `80` (mapped to host `3000`)
- **Proxy**: API calls routed to backend
- **Health Check**: Custom nginx health endpoint

### 3. Database Container
- **Base Image**: `postgres:15-alpine`
- **Database**: `paymentorchestrator`
- **Exposed Port**: `5432`
- **Persistence**: Named volume `postgres_data`
- **Initialization**: Custom SQL scripts

### 4. pgAdmin Container (Optional)
- **Base Image**: `dpage/pgadmin4:latest`
- **Exposed Port**: `8081`
- **Purpose**: Database management interface

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- At least 4GB RAM available for Docker

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd PaymentOrchestrator
```

### 2. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### 3. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger (dev only)
- **Database**: localhost:5432
- **pgAdmin**: http://localhost:8081

### 4. Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This deletes database data)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

#### Backend (.NET 8 API)
```yaml
environment:
  ASPNETCORE_ENVIRONMENT: Production
  ASPNETCORE_URLS: http://+:8080
  ConnectionStrings__DefaultConnection: "Host=database;Port=5432;Database=paymentorchestrator;Username=postgres;Password=devpassword123"
  CORS__AllowedOrigins: "http://localhost:3000,http://frontend"
```

#### Frontend (React)
```yaml
environment:
  - REACT_APP_API_BASE_URL=http://localhost:8080/api
```

#### Database (PostgreSQL)
```yaml
environment:
  POSTGRES_DB: paymentorchestrator
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: devpassword123
  PGDATA: /var/lib/postgresql/data/pgdata
```

### Port Mapping
| Service   | Container Port | Host Port | Description                    |
|-----------|----------------|-----------|--------------------------------|
| Frontend  | 80            | 3000      | React application             |
| Backend   | 8080          | 8080      | .NET 8 Web API               |
| Database  | 5432          | 5432      | PostgreSQL database           |
| pgAdmin   | 80            | 8081      | Database management web UI    |

## 📊 Database Management

### Connect to PostgreSQL
```bash
# Using psql
docker exec -it paymentorchestrator-db psql -U postgres -d paymentorchestrator

# Using pgAdmin (Web UI)
# Navigate to http://localhost:8081
# Email: admin@paymentorchestrator.com
# Password: admin123
```

### Database Connection Details
- **Host**: localhost (or `database` within Docker network)
- **Port**: 5432
- **Database**: paymentorchestrator
- **Username**: postgres
- **Password**: devpassword123

### Backup and Restore
```bash
# Backup database
docker exec paymentorchestrator-db pg_dump -U postgres paymentorchestrator > backup.sql

# Restore database
docker exec -i paymentorchestrator-db psql -U postgres paymentorchestrator < backup.sql
```

## 🔍 Monitoring and Debugging

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Follow logs in real-time
docker-compose logs -f backend
```

### Health Checks
```bash
# Check container health status
docker ps

# Test health endpoints
curl http://localhost:8080/health    # Backend health
curl http://localhost:3000/health    # Frontend health
```

### Container Management
```bash
# List running containers
docker-compose ps

# Access container shell
docker exec -it paymentorchestrator-api /bin/bash
docker exec -it paymentorchestrator-frontend /bin/sh

# View container resource usage
docker stats
```

## 🛠️ Development Workflow

### Development Mode
For development with hot reload and debugging:

1. **Use override file**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

2. **Volume mounting**: Source code changes are reflected in real-time
3. **Debug ports**: Different ports to avoid conflicts
4. **Environment**: Development environment variables

### Production Deployment

#### 1. Environment-Specific Configuration
Create `.env` file:
```bash
# .env
POSTGRES_PASSWORD=your_secure_password_here
PGADMIN_DEFAULT_PASSWORD=your_admin_password_here
ASPNETCORE_ENVIRONMENT=Production
```

#### 2. Security Considerations
```bash
# Use secrets for sensitive data
docker secret create postgres_password postgres_password.txt
docker secret create pgadmin_password pgadmin_password.txt
```

#### 3. SSL/HTTPS Configuration
- Configure nginx with SSL certificates
- Update CORS policies for production domains
- Use environment variables for production URLs

## 📋 Common Tasks

### Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm paymentorchestrator-postgres-data

# Restart services (will recreate database)
docker-compose up --build
```

### Update Application
```bash
# Rebuild containers with latest changes
docker-compose up --build

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Scale Services
```bash
# Scale backend service (load balancing)
docker-compose up --scale backend=3

# Note: Frontend and database should not be scaled
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
netstat -tulpn | grep :5432

# Solution: Change ports in docker-compose.yml
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs database

# Verify network connectivity
docker exec paymentorchestrator-api ping database
```

#### 3. Frontend API Connection Issues
```bash
# Check environment variables
docker exec paymentorchestrator-frontend env | grep REACT_APP

# Verify nginx configuration
docker exec paymentorchestrator-frontend cat /etc/nginx/conf.d/default.conf
```

#### 4. Permission Issues
```bash
# Linux/macOS: Fix permissions
sudo chown -R $(whoami):$(whoami) .

# Windows: Run as administrator or check Docker settings
```

### Performance Optimization

#### 1. Resource Limits
Add to docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: "0.5"
    reservations:
      memory: 256M
      cpus: "0.25"
```

#### 2. Build Optimization
```bash
# Use multi-stage builds (already implemented)
# Optimize .dockerignore files
# Use specific base image tags
```

## 🔐 Security Best Practices

1. **Passwords**: Use strong, unique passwords
2. **Networks**: Use custom networks (implemented)
3. **Volumes**: Use named volumes for data persistence
4. **Users**: Run containers as non-root users (implemented)
5. **Secrets**: Use Docker secrets for sensitive data in production
6. **Updates**: Keep base images updated regularly

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)
- [.NET Docker Hub](https://hub.docker.com/_/microsoft-dotnet-aspnet/)