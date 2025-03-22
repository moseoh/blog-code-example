# Kubespray

## Prepare

```shell
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 설치

### 연결 확인

```shell
ansible -i inventory/mycluster/inventory.ini all -m ping --private-key=~/.ssh/moseoh_master
```

### 클러스터 설치

```shell
# 설치
ansible-playbook -i inventory/mycluster/inventory.ini cluster.yml -b -v --private-key=~/.ssh/moseoh_master --ask-become-pass

# 초기화
ansible-playbook -i inventory/mycluster/inventory.ini reset.yml -b -v --private-key=~/.ssh/moseoh_master --ask-become-pass
```

### kubeconfig 파일 설정

```shell

ssh master
sudo cp /etc/kubernetes/admin.conf ./
sudo chown moseoh:moseoh ./admin.conf
exit

export MASTER_IP=192.168.0.50
mkdir ~/.kube
rsync master:~/admin.conf ~/.kube/config
chmod 600 ~/.kube/config
export KUBECONFIG=~/.kube/config
sed -i '' "s/127.0.0.1/$MASTER_IP/g" ~/.kube/config

# 설치 확인
kubectl get nodes
kubectl cluster-info
kubectl get cs
```

