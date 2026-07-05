# Docker Setup - M365 AgentOps Backend

## ✅ Now Supports PowerShell 7 + Exchange Online Management

The backend now runs on **PowerShell 7 (Linux)** with full Microsoft 365 module support:
- ✅ Exchange Online Management
- ✅ Microsoft Graph
- ✅ Teams
- ✅ SharePoint
- ✅ PnP.PowerShell
- ✅ Node.js backend

---

## Quick Start with Docker

### 1. **Build the Image**

```bash
# From project root
docker build -t m365ops-backend:latest ./backend
```

This will:
- ✅ Install PowerShell 7 on Ubuntu
- ✅ Install Node.js 20 LTS
- ✅ Install all M365 PowerShell modules
- ✅ Install Node dependencies
- ✅ Verify installations

### 2. **Run the Container**

```bash
# Simple run
docker run -d \
  -p 3000:3000 \
  -e AZURE_TENANT_ID="b9cc8284-05ed-452f-877a-970779430dcb" \
  -e AZURE_CLIENT_ID="04d3be8d-d433-4367-893e-eccc82190a11" \
  -e AZURE_CLIENT_SECRET="YOUR_SECRET" \
  -e NODE_ENV="production" \
  m365ops-backend:latest
```

Or use **Docker Compose** (easier):

```bash
# Set environment variable first
export AZURE_CLIENT_SECRET="YOUR_SECRET"

# Start container
docker-compose up -d

# Check logs
docker-compose logs -f m365-backend

# Stop container
docker-compose down
```

### 3. **Verify Running**

```bash
# Check if container is running
docker ps | grep m365-agentops-backend

# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"...","service":"M365 AgentOps Backend"}
```

---

## Environment Variables

Required for production:

```bash
AZURE_TENANT_ID              # Your tenant ID
AZURE_CLIENT_ID              # App registration client ID
AZURE_CLIENT_SECRET          # App registration secret
FRONTEND_URL                 # Frontend URL (http://localhost:5174 for dev)
PORT                         # Backend port (default: 3000)
NODE_ENV                     # development or production
SHAREPOINT_SITE_ID          # Your SharePoint site ID
```

---

## Container Features

### PowerShell 7 Runtime
```bash
# Interactive PowerShell shell
docker exec -it m365-agentops-backend pwsh

# Inside container, you can run:
Get-Module ExchangeOnlineManagement -ListAvailable
Connect-ExchangeOnline -Device
Get-EXOMailbox -ResultSize 10
```

### Node.js Backend
```bash
# Container runs on Node.js
# Backend at: http://localhost:3000/api
# Health check: http://localhost:3000/api/health
```

### Automatic Health Checks
The container includes built-in health checks:
```bash
# View health status
docker inspect --format='{{json .State.Health}}' m365-agentops-backend
```

---

## Deployment to Azure

### Option A: Azure Container Instances (ACI)

```bash
# Build image
docker build -t m365ops-backend:latest ./backend

# Tag for Azure
docker tag m365ops-backend:latest m365opsacr.azurecr.io/m365ops-backend:latest

# Push to ACR
docker push m365opsacr.azurecr.io/m365ops-backend:latest

# Deploy to ACI
az container create \
  --resource-group m365-agentops-rg \
  --name m365ops-api-container \
  --image m365opsacr.azurecr.io/m365ops-backend:latest \
  --cpu 2 \
  --memory 3.5 \
  --ports 3000 \
  --environment-variables \
    AZURE_TENANT_ID="..." \
    AZURE_CLIENT_ID="..." \
    AZURE_CLIENT_SECRET="..."
```

### Option B: Azure Container Apps (Recommended)

```bash
# Create container app
az containerapp create \
  --name m365ops-backend \
  --resource-group m365-agentops-rg \
  --image m365opsacr.azurecr.io/m365ops-backend:latest \
  --target-port 3000 \
  --environment m365ops-env \
  --env-vars \
    AZURE_TENANT_ID="..." \
    AZURE_CLIENT_ID="..." \
    AZURE_CLIENT_SECRET="..." \
  --min-replicas 1 \
  --max-replicas 3
```

### Option C: Azure Kubernetes Service (AKS)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: m365ops-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: m365ops-backend
  template:
    metadata:
      labels:
        app: m365ops-backend
    spec:
      containers:
      - name: m365ops-backend
        image: m365opsacr.azurecr.io/m365ops-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: AZURE_TENANT_ID
          valueFrom:
            secretKeyRef:
              name: m365-secrets
              key: tenant-id
        - name: AZURE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: m365-secrets
              key: client-id
        - name: AZURE_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: m365-secrets
              key: client-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 30
```

Deploy with:
```bash
kubectl apply -f deployment.yaml
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs m365-agentops-backend

# Common issues:
# - Azure credentials invalid
# - Missing environment variables
# - Port already in use
```

### PowerShell modules not loading
```bash
# Verify modules inside container
docker exec m365-agentops-backend pwsh -Command \
  "Get-Module ExchangeOnlineManagement, Microsoft.Graph -ListAvailable"

# Reinstall if needed
docker exec m365-agentops-backend pwsh -Command \
  "Set-PSRepository PSGallery -InstallationPolicy Trusted; \
   Install-Module ExchangeOnlineManagement -Force -AcceptLicense"
```

### Health check failing
```bash
# Test manually
docker exec m365-agentops-backend \
  node -e "require('http').get('http://localhost:3000/api/health', r => console.log(r.statusCode))"

# Check backend logs
docker logs m365-agentops-backend | tail -50
```

---

## Performance Optimization

### Multi-stage Build (Optional)
Current Dockerfile is already optimized with:
- Minimal base image (PowerShell 7 on Ubuntu)
- Production-only npm dependencies
- Non-root user for security

### Container Resources
Recommended settings:
- **CPU:** 2 cores (minimum 1 core)
- **Memory:** 3.5 GB (minimum 2 GB)
- **Storage:** 2 GB (for PowerShell modules)

### Scaling
```bash
# Docker Swarm
docker service create \
  --name m365ops-backend \
  --replicas 3 \
  m365ops-backend:latest

# Kubernetes
kubectl scale deployment m365ops-backend --replicas=5
```

---

## Next Steps

1. **Build image locally:**
   ```bash
   docker build -t m365ops-backend:latest ./backend
   ```

2. **Test with docker-compose:**
   ```bash
   docker-compose up -d
   docker-compose logs -f
   ```

3. **Push to Azure Container Registry:**
   ```bash
   docker push m365opsacr.azurecr.io/m365ops-backend:latest
   ```

4. **Deploy to Azure:** See options A, B, or C above

---

## References

- [PowerShell 7 on Linux](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux)
- [Exchange Online PowerShell V3](https://learn.microsoft.com/en-us/powershell/exchange/exchange-online-powershell-v2)
- [Docker Official Documentation](https://docs.docker.com/)
- [Azure Container Instances](https://learn.microsoft.com/en-us/azure/container-instances/)
- [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
