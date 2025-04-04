# Ansible

## 설치

```shell
uv init ansible-python # ansible 패키지 이름과 동일하면 안됨.
uv add ansible
source .venv/bin/activate
ansible-playbook --version
```

## Init Host

### ssh 용 키 생성

```shell
ssh-keygen -t rsa -b 4096 -C "azqazq195@gmail.com" -f ~/.ssh/moseoh_master
```

### 실행

```shell
# ./inventory/inventory.ini > host 정보 수정
# host 에 한번 접속하여 kwon_hosts에 정보를 갱신해야함.
ansible init -i inventory/inventory.ini -m ping
ansible dhcp -i inventory/inventory.ini -m ping

ansible-playbook -i inventory/inventory.ini playbooks/init_config.yml --limit init -v

ansible-playbook -i inventory/inventory.ini setup_base.yml --limit init -v
ansible-playbook -i inventory/inventory.ini reset.yml --limit init -v
ansible-playbook -i inventory/inventory.ini dhcp_server.yml -v
```
