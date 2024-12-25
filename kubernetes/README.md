# Kubernetes 실습 환경 구성

## 1. Vagrantfile 작성

required

- VMWare
- Vagrant
- SSH 키 생성 (`~/.ssh/id_rsa.pub`)

## 2. Vagrantfile 실행

```shell
# VM 실행
vagrant up

# VM 중단
vagrant halt

# 프로비저닝 재실행 (VM 실행 중에 설정 변경 시)
vagrant provision

# VM 초기화 후 재시작
vagrant destroy -f
vagrant up
```

## 3. VM 접속

```shell
# 직접 SSH로 접속
ssh vagrant@[VM_IP]

# vagrant ssh 명령으로 접속
vagrant ssh master
```
