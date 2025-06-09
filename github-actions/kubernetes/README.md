# ARC with k3d

## 설치

```shell
# kubernetes
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# k3d
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## 배포

```shell
# cluster 생성
k3d cluster create arc-cluster --agents 2

# OpenEBS 스토리지 프로바이더 설치
helm repo add openebs https://openebs.github.io/openebs
helm repo update
helm install openebs openebs/openebs -n openebs --create-namespace

# ARC Controller 배포
NAMESPACE="arc-systems"
helm install arc \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller

# ARC Runner Set 배포
helm dependency update ./arc-runners

INSTALLATION_NAME="k8s"
NAMESPACE="arc-runners"
GITHUB_CONFIG_URL=""
GITHUB_PAT=""
helm install "${INSTALLATION_NAME}" \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    --set gha-runner-scale-set.githubConfigUrl="${GITHUB_CONFIG_URL}" \
    --set gha-runner-scale-set.githubConfigSecret.github_token="${GITHUB_PAT}" \
    -f ./arc-runners/values.yaml \
    ./arc-runners

# ARC Runner Set 삭제

```shell
# ARC Runner Set 삭제
helm uninstall "${INSTALLATION_NAME}" --namespace "${NAMESPACE}"

# 네임스페이스 삭제 (선택사항)
kubectl delete namespace "${NAMESPACE}"
```