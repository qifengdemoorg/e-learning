# E-Learning Frontend Azure AKS Deployment

This directory contains all the necessary Kubernetes manifests and deployment scripts for deploying the E-Learning frontend application to Azure Kubernetes Service (AKS).

## 📁 Directory Structure

```
deployment/aks/frontend/
├── 01-namespace.yaml           # Kubernetes namespace
├── 02-configmap.yaml          # Configuration management
├── 03-deployment.yaml         # Application deployment
├── 04-service.yaml            # Service definitions
├── 05-ingress.yaml            # Ingress controllers (Azure App Gateway & Nginx)
├── 06-hpa.yaml                # Horizontal Pod Autoscaler & Pod Disruption Budget
├── 07-network-policy.yaml     # Network policies & Service Monitor
├── deploy.sh                  # Deployment automation script
└── README.md                  # This documentation
```

## 🚀 Quick Start

### Prerequisites

1. **Azure CLI** installed and configured
2. **kubectl** installed and configured
3. **AKS cluster** running and accessible
4. **Azure Container Registry (ACR)** set up and integrated with AKS
5. **Docker image** built and pushed to ACR

### Deployment Steps

1. **Clone the repository** and navigate to the frontend deployment directory:
   ```bash
   cd deployment/aks/frontend/
   ```

2. **Update configuration** in `02-configmap.yaml`:
   - Set correct API URLs
   - Configure environment-specific variables

3. **Update domain names** in `05-ingress.yaml`:
   - Replace `elearning.azure.example.com` with your actual domain
   - Update TLS certificate names if needed

4. **Deploy the application**:
   ```bash
   ./deploy.sh
   ```

5. **Check deployment status**:
   ```bash
   ./deploy.sh status
   ```

6. **View application logs**:
   ```bash
   ./deploy.sh logs
   ```

## 🛠️ Manual Deployment

If you prefer to deploy manually or need more control:

```bash
# Apply manifests in order
kubectl apply -f 01-namespace.yaml
kubectl apply -f 02-configmap.yaml
kubectl apply -f 03-deployment.yaml
kubectl apply -f 04-service.yaml
kubectl apply -f 05-ingress.yaml
kubectl apply -f 06-hpa.yaml
kubectl apply -f 07-network-policy.yaml

# Check deployment
kubectl get all -n elearning
```

## 📋 Configuration Details

### Environment Variables

The application supports the following environment variables (configured in `02-configmap.yaml`):

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node.js environment | `production` |
| `API_BASE_URL` | Backend API URL | `https://api.elearning.azure.example.com` |
| `APP_TITLE` | Application title | `E-Learning Platform` |
| `ENABLE_ANALYTICS` | Enable analytics tracking | `true` |
| `LOG_LEVEL` | Logging level | `info` |

### Resource Limits

The deployment is configured with the following resource limits:

- **CPU Request**: 100m
- **CPU Limit**: 500m
- **Memory Request**: 128Mi
- **Memory Limit**: 512Mi

### Auto-scaling

The Horizontal Pod Autoscaler (HPA) is configured to:

- **Min Replicas**: 2
- **Max Replicas**: 10
- **CPU Target**: 70%
- **Memory Target**: 80%

## 🌐 Ingress Configuration

Two ingress configurations are provided:

### 1. Azure Application Gateway Ingress Controller (AGIC)
- **File**: First section of `05-ingress.yaml`
- **Features**: SSL termination, health probes, connection draining
- **Best for**: Production Azure environments

### 2. Nginx Ingress Controller
- **File**: Second section of `05-ingress.yaml`
- **Features**: Rate limiting, CORS, security headers
- **Best for**: Multi-cloud or on-premises deployments

## 🔒 Security Features

### Network Policies
- Restricts ingress traffic to authorized sources
- Allows egress to DNS, HTTPS, and backend services
- Isolates frontend pods from unauthorized network access

### Pod Security Context
- Runs as non-root user (ID: 101)
- Read-only root filesystem
- Drops all capabilities
- Prevents privilege escalation

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)

## 📊 Monitoring & Observability

### Health Checks
- **Liveness Probe**: `/health` endpoint on port 8080
- **Readiness Probe**: `/` endpoint on port 8080
- **Startup Probe**: 30-second timeout for initial startup

### Metrics
- Prometheus metrics available at `/metrics`
- ServiceMonitor configured for automatic discovery
- Resource usage monitoring enabled

## 🔧 Troubleshooting

### Common Issues

1. **Pods not starting**:
   ```bash
   kubectl describe pods -n elearning -l app=elearning-frontend
   kubectl logs -n elearning -l app=elearning-frontend
   ```

2. **Service not accessible**:
   ```bash
   kubectl get svc -n elearning
   kubectl describe svc elearning-frontend-service -n elearning
   ```

3. **Ingress issues**:
   ```bash
   kubectl get ingress -n elearning
   kubectl describe ingress elearning-frontend-ingress -n elearning
   ```

4. **External IP not assigned**:
   ```bash
   kubectl get svc elearning-frontend-service -n elearning --watch
   ```

### Debug Commands

```bash
# Check all resources
kubectl get all -n elearning

# Check events
kubectl get events -n elearning --sort-by='.lastTimestamp'

# Check pod logs
kubectl logs -n elearning deployment/elearning-frontend-deployment -f

# Access pod shell for debugging
kubectl exec -it -n elearning deployment/elearning-frontend-deployment -- /bin/sh

# Check HPA status
kubectl get hpa -n elearning
kubectl describe hpa elearning-frontend-hpa -n elearning
```

## 🧹 Cleanup

To remove the frontend deployment:

```bash
./deploy.sh cleanup
```

Or manually:

```bash
kubectl delete -f 07-network-policy.yaml
kubectl delete -f 06-hpa.yaml
kubectl delete -f 05-ingress.yaml
kubectl delete -f 04-service.yaml
kubectl delete -f 03-deployment.yaml
kubectl delete -f 02-configmap.yaml
# Namespace deletion (optional - may contain other resources)
# kubectl delete -f 01-namespace.yaml
```

## 🔄 CI/CD Integration

This deployment is designed to work with the GitHub Actions workflow in `.github/workflows/frontend-deploy.yml`. The workflow:

1. Builds the Docker image
2. Pushes to Azure Container Registry
3. Updates the Kubernetes deployment
4. Performs security scans
5. Sends notifications

## 📝 Customization

### Scaling

To adjust scaling parameters, modify `06-hpa.yaml`:

```yaml
spec:
  minReplicas: 3      # Increase minimum replicas
  maxReplicas: 20     # Increase maximum replicas
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60  # Lower threshold for more aggressive scaling
```

### Resource Limits

To adjust resource allocation, modify `03-deployment.yaml`:

```yaml
resources:
  requests:
    memory: "256Mi"   # Increase memory request
    cpu: "200m"       # Increase CPU request
  limits:
    memory: "1Gi"     # Increase memory limit
    cpu: "1000m"      # Increase CPU limit
```

### Custom Domain

1. Update `05-ingress.yaml` with your domain
2. Configure DNS to point to the ingress IP
3. Obtain and configure SSL certificates

## 📚 Additional Resources

- [Azure Kubernetes Service Documentation](https://docs.microsoft.com/en-us/azure/aks/)
- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [Azure Application Gateway Ingress Controller](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-overview)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)

## 🤝 Support

For issues related to this deployment:

1. Check the troubleshooting section above
2. Review application logs: `./deploy.sh logs`
3. Check cluster events: `kubectl get events -n elearning`
4. Contact the development team with detailed error information
