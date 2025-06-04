# Github Actions Runner Bare Metal

## 설치 방법

직접 설정:

https://github.com/moseoh/github-actions-runner-test/settings/actions/runners/new?arch=x64&os=linux

```bash
# config.sh 명령에 아래 옵션 추가
--labels linux-bare-metal-1 --name linux-bare-metal-1
--labels linux-bare-metal-2 --name linux-bare-metal-2

--labels mac-bare-metal-1 --name mac-bare-metal-1
--labels mac-bare-metal-2 --name mac-bare-metal-2
```

### 백그라운드 실행 방법
```bash
nohup ./bare-metal/actions-runner-1/run.sh > /dev/null 2>&1 &
nohup ./bare-metal/actions-runner-2/run.sh > /dev/null 2>&1 &
```
