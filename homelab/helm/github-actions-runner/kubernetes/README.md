# Github Actions Runners controller

## Runner Controller 설치

```shell
NAMESPACE="arc-systems"
helm install arc \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
```

## Runner Controller Set 설치

```shell
# PAT Token 등록
NAMESPACE="arc-runners"
kubectl create namespace "${NAMESPACE}"
kubectl create secret generic arc-secret \
   --namespace="${NAMESPACE}" \
   --from-literal=github_token='TOKEN'

NAMESPACE="arc-runners"
INSTALLATION_NAME="arc-runner-set"
helm upgrade --install ${INSTALLATION_NAME} \
    --namespace "${NAMESPACE}" \
    -f values.yaml \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
```

## dockerMtu

- ARC Pod 내부 mtu는 1500
- Kubernetes cali mtu는 1450
- node의 mtu는 1500
