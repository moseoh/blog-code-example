#!/bin/bash

# 환경 변수 설정
REPO_URL="https://github.com/OWNER/REPO"
RUNNER_TOKEN="YOUR_TOKEN"

# Runner 1 설치
echo "Installing runner-1..."
mkdir actions-runner-1 && cd actions-runner-1

# GitHub에서 runner 다운로드
curl -o actions-runner-osx-x64-2.316.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.316.0/actions-runner-osx-x64-2.316.0.tar.gz

# 압축 해제
tar xzf ./actions-runner-osx-x64-2.316.0.tar.gz

# 설정 및 실행
./config.sh --url $REPO_URL --token $RUNNER_TOKEN --name runner-1
nohup ./run.sh > runner-1.log 2>&1 &

cd ..

# Runner 2 설치
echo "Installing runner-2..."
mkdir actions-runner-2 && cd actions-runner-2

# GitHub에서 runner 다운로드
curl -o actions-runner-osx-x64-2.316.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.316.0/actions-runner-osx-x64-2.316.0.tar.gz

# 압축 해제
tar xzf ./actions-runner-osx-x64-2.316.0.tar.gz

# 설정 및 실행
./config.sh --url $REPO_URL --token $RUNNER_TOKEN --name runner-2
nohup ./run.sh > runner-2.log 2>&1 &

cd ..

echo "Both runners installed and started!"
echo "Check logs: tail -f actions-runner-1/runner-1.log"
echo "Check logs: tail -f actions-runner-2/runner-2.log"