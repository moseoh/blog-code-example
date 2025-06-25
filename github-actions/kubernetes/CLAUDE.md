# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains infrastructure code for deploying GitHub Actions Runner Controller (ARC) on Kubernetes with persistent storage for caching. It includes two main components:

1. **ARC Runners**: Helm chart configuration for deploying self-hosted GitHub Actions runners in Kubernetes
2. **NFS Server**: Docker-based NFS server for shared storage across runner pods

## Architecture

### ARC (Actions Runner Controller) Setup
- Uses Helm charts to deploy GitHub Actions self-hosted runners in Kubernetes
- Configured for Kubernetes containerMode with persistent volume claims
- Supports 1-5 auto-scaling runners with OpenEBS storage backend
- Includes shared cache volume (`actions-cache-pvc`) mounted at `/cache` in runner pods

### Storage Architecture
```
Runner Pods (1-5) -> PVC (openebs-hostpath) -> Shared Cache Storage
                  -> Work Volume (10Gi each)
```

### NFS Component
- Alpine-based NFS server container for external shared storage scenarios
- Exports `/nfs_share` directory with full read/write permissions
- Can be integrated with k3d clusters using custom networks

## Key Commands

### Cluster Setup
```shell
# Create k3d cluster
k3d cluster create arc-cluster --agents 2

# Install OpenEBS storage provider
helm repo add openebs https://openebs.github.io/openebs
helm repo update
helm install openebs openebs/openebs -n openebs --create-namespace
```

### ARC Controller Deployment
```shell
# Deploy ARC Controller
NAMESPACE="arc-systems"
helm install arc \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
```

### ARC Runner Set Deployment
```shell
# Update dependencies
helm dependency update ./arc-runners

# Deploy runner set (requires GitHub config)
INSTALLATION_NAME="k8s"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL="https://github.com/your-org/your-repo"
GITHUB_PAT="your-github-token"
helm install "${INSTALLATION_NAME}" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set gha-runner-scale-set.githubConfigUrl="${GITHUB_CONFIG_URL}" \
    --set gha-runner-scale-set.githubConfigSecret.github_token="${GITHUB_PAT}" \
    -f ./arc-runners/values.yaml \
    ./arc-runners
```

### Cleanup
```shell
# Remove runner set
helm uninstall "${INSTALLATION_NAME}" --namespace "${NAMESPACE}"
kubectl delete namespace "${NAMESPACE}"
```

### NFS Server (Optional)
```shell
# Build and run NFS server
cd nfs/
docker-compose up -d

# For k3d integration with custom network
k3d cluster create my-nfs-cluster --network nfs-server-project_nfs-net
```

## Configuration Files

### `arc-runners/values.yaml`
- Main configuration for GitHub Actions runners
- Set `githubConfigUrl` and `github_token` for your repository
- Runner scaling: `minRunners: 1`, `maxRunners: 5`
- Storage: Uses `openebs-hostpath` with 10Gi work volumes per runner
- Cache: Shared 20Gi PVC mounted at `/cache`

### `arc-runners/templates/pvc-actions-cache.yaml`
- Defines the shared cache PVC used by all runner pods
- 20Gi storage using `openebs-hostpath` storage class

### `nfs/docker-compose.yml`
- NFS server configuration for external shared storage
- Exposes standard NFS ports (111, 2049, 32765-32767)

## Development Notes

- No traditional build/test/lint commands - this is infrastructure configuration
- Test deployments in k3d clusters before production use
- Always verify storage class availability before deploying
- Monitor runner pod resource usage and adjust PVC sizes accordingly
- GitHub PAT requires `repo` scope for private repositories, `public_repo` for public ones