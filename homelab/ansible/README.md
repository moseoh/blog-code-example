# Ansible

## Prepare

```shell
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Init Host

### ssh 용 키 생성

```shell
ssh-keygen -t rsa -b 4096 -C "azqazq195@gmail.com" -f ~/.ssh/moseoh_master
```

### 실행

```shell
# ./inventory/inventory.ini > host 정보 수정
ansible init -i inventory/inventory.ini -m ping
ansible dhcp -i inventory/inventory.ini -m ping

ansible-playbook -i inventory/inventory.ini setup_base.yml --limit init -v
ansible-playbook -i inventory/inventory.ini reset.yml --limit init -v
ansible-playbook -i inventory/inventory.ini dhcp_server.yml -v
```
