#!/bin/bash

OWNER=$OWNER
REPO=$REPO
GITHUB_TOKEN=$GITHUB_TOKEN
RUNNER_NAME=$RUNNER_NAME
RUNNER_LABELS=$RUNNER_LABELS

RESPONSE=$(curl -L  -X POST  -H "Accept: application/vnd.github+json"   -H "Authorization: Bearer ${GITHUB_TOKEN}"   -H "X-GitHub-Api-Version: 2022-11-28"   https://api.github.com/repos/${OWNER}/${REPO}/actions/runners/registration-token)
RUNNER_TOKEN=$(echo $RESPONSE | jq -r '.token')

cd /home/docker/actions-runner || exit
./config.sh --url https://github.com/${OWNER}/${REPO} --token ${RUNNER_TOKEN} --name ${RUNNER_NAME} --labels ${RUNNER_LABELS}

cleanup() {
  echo "Removing runner..."
  ./config.sh remove --unattended --token ${RUNNER_TOKEN}
}

trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

./run.sh & wait $!