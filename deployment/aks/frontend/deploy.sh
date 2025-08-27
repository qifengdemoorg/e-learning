#!/bin/bash

# E-Learning Frontend AKS Deployment Script
# This script deploys the frontend application to Azure Kubernetes Service

set -euo pipefail

# Configuration
NAMESPACE="elearning"
DEPLOYMENT_NAME="elearning-frontend-deployment"
SERVICE_NAME="elearning-frontend-service"
MANIFEST_DIR="$(dirname "$0")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if kubectl is installed and configured
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    # Check if we can connect to the cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    
    # Check if Azure CLI is installed (optional)
    if command -v az &> /dev/null; then
        log_info "Azure CLI detected: $(az --version | head -n1)"
    else
        log_warning "Azure CLI not found. Some features may be limited."
    fi
    
    log_success "Prerequisites check completed"
}

# Apply Kubernetes manifests
apply_manifests() {
    log_info "Applying Kubernetes manifests..."
    
    local manifests=(
        "01-namespace.yaml"
        "02-configmap.yaml"
        "03-deployment.yaml"
        "04-service.yaml"
        "05-ingress.yaml"
        "06-hpa.yaml"
        "07-network-policy.yaml"
    )
    
    for manifest in "${manifests[@]}"; do
        local manifest_path="${MANIFEST_DIR}/${manifest}"
        if [[ -f "$manifest_path" ]]; then
            log_info "Applying $manifest..."
            kubectl apply -f "$manifest_path"
            log_success "$manifest applied successfully"
        else
            log_warning "$manifest not found, skipping..."
        fi
    done
}

# Wait for deployment to be ready
wait_for_deployment() {
    log_info "Waiting for deployment to be ready..."
    
    kubectl wait --for=condition=available --timeout=300s deployment/$DEPLOYMENT_NAME -n $NAMESPACE
    
    if [[ $? -eq 0 ]]; then
        log_success "Deployment is ready!"
    else
        log_error "Deployment failed to become ready within timeout"
        return 1
    fi
}

# Get service information
get_service_info() {
    log_info "Getting service information..."
    
    echo "Service Details:"
    kubectl get service $SERVICE_NAME -n $NAMESPACE -o wide
    
    echo ""
    echo "Endpoints:"
    kubectl get endpoints $SERVICE_NAME -n $NAMESPACE
    
    # Try to get external IP if it's a LoadBalancer service
    local service_type=$(kubectl get service $SERVICE_NAME -n $NAMESPACE -o jsonpath='{.spec.type}')
    if [[ "$service_type" == "LoadBalancer" ]]; then
        log_info "Waiting for external IP assignment..."
        kubectl get service $SERVICE_NAME -n $NAMESPACE --watch &
        local watch_pid=$!
        
        # Wait up to 5 minutes for external IP
        local timeout=300
        local elapsed=0
        while [[ $elapsed -lt $timeout ]]; do
            local external_ip=$(kubectl get service $SERVICE_NAME -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
            if [[ -n "$external_ip" && "$external_ip" != "null" ]]; then
                kill $watch_pid 2>/dev/null || true
                log_success "External IP assigned: $external_ip"
                echo "Application URL: http://$external_ip"
                break
            fi
            sleep 10
            elapsed=$((elapsed + 10))
        done
        
        if [[ $elapsed -ge $timeout ]]; then
            kill $watch_pid 2>/dev/null || true
            log_warning "External IP not assigned within timeout. Check service configuration."
        fi
    fi
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    
    echo "Namespace:"
    kubectl get namespace $NAMESPACE
    
    echo ""
    echo "Pods:"
    kubectl get pods -n $NAMESPACE -l app=elearning-frontend
    
    echo ""
    echo "Services:"
    kubectl get services -n $NAMESPACE
    
    echo ""
    echo "Ingress:"
    kubectl get ingress -n $NAMESPACE
    
    echo ""
    echo "HPA:"
    kubectl get hpa -n $NAMESPACE
}

# Show logs
show_logs() {
    log_info "Recent application logs:"
    kubectl logs -n $NAMESPACE -l app=elearning-frontend --tail=50
}

# Cleanup function
cleanup() {
    log_info "Cleaning up frontend deployment..."
    
    local manifests=(
        "07-network-policy.yaml"
        "06-hpa.yaml"
        "05-ingress.yaml"
        "04-service.yaml"
        "03-deployment.yaml"
        "02-configmap.yaml"
    )
    
    for manifest in "${manifests[@]}"; do
        local manifest_path="${MANIFEST_DIR}/${manifest}"
        if [[ -f "$manifest_path" ]]; then
            log_info "Deleting resources from $manifest..."
            kubectl delete -f "$manifest_path" --ignore-not-found=true
        fi
    done
    
    # Don't delete namespace as it might contain other resources
    log_warning "Namespace '$NAMESPACE' was not deleted. Delete manually if needed."
}

# Main deployment function
deploy() {
    log_info "Starting E-Learning Frontend deployment to AKS..."
    
    check_prerequisites
    apply_manifests
    wait_for_deployment
    get_service_info
    show_status
    
    log_success "Frontend deployment completed successfully!"
    log_info "Run '$0 logs' to view application logs"
    log_info "Run '$0 status' to check deployment status"
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            deploy
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy the frontend application (default)"
            echo "  status   - Show deployment status"
            echo "  logs     - Show application logs"
            echo "  cleanup  - Remove frontend deployment"
            echo "  help     - Show this help message"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
