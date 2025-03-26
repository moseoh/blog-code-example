# Python 3.13 slim 이미지를 기본으로 사용
FROM python:3.13-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 필요한 파일들을 컨테이너로 복사
COPY pyproject.toml ./
COPY server.py ./

# Python 패키지 설치 및 uv 설치
RUN pip install --no-cache-dir . && \
    pip install --no-cache-dir uv

# 컨테이너 실행 명령
ENTRYPOINT ["uv", "run", "server.py"] 