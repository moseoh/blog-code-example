```ini
node1 ansible_user=vagrant ansible_host=192.168.56.10 ip=10.3.0.1
node2 ansible_user=vagrant ansible_host=192.168.56.11 ip=10.3.0.2
node3 ansible_user=vagrant ansible_host=192.168.56.12 ip=10.3.0.3

[kube_control_plane]
node1

[etcd]
node1
node2
node3

[kube_node]
node2
node3
```

python 및 ansible 설정

https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/ansible.md#installing-ansible
ansible, python 설치 및 버전 확인

```shell
# kubespray dir
python3 -m venv venv
source venv/bin/activate
pip install -U -r requirements.txt

# 2.16.14
ansible --version

# ping
ansible all -i inventory/mycluster/inventory.ini -m ping --private-key=~/.ssh/id_rsa

# 설치
ansible-playbook -i inventory/mycluster/inventory.ini cluster.yml -b -v --private-key=~/.ssh/id_rsa
# 삭제
ansible-playbook -i inventory/mycluster/inventory.ini reset.yml -b -v --private-key=~/.ssh/id_rsa

# kubeconfig 복사
ssh vagrant@192.168.56.10
sudo chown -R vagrant:vagrant /etc/kubernetes/admin.conf
exit

mkdir ~/.kube
scp vagrant@192.168.56.10:/etc/kubernetes/admin.conf ~/.kube/config
chmod 600 ~/.kube/config

# kubeconfig의 서버 IP 변경 (macOS)
sed -i '' "s|server: https://[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}:6443|server: https://192.168.63.151:6443|g" ~/.kube/config
cat ~/.kube/config
```
