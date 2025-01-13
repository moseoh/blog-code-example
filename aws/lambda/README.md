# 프로젝트 폴더 생성

mkdir lambda-thumbnail
cd lambda-thumbnail

# Python 가상환경 생성 및 활성화

python3 -m venv .venv
source .venv/bin/activate

# 필요한 패키지 설치

pip install Pillow boto3
pip freeze > requirements.txt

# Build

# SAM 빌드

sam build

# 로컬 테스트

sam local invoke -e events/s3-event.json

# API 로컬 실행 (필요한 경우)

sam local start-api

# 첫 배포시

sam deploy --guided

# 이후 배포시

sam deploy
