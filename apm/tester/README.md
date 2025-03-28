# k6

## 실행 

compose 로 실행

```bash
# dash board 실행
docker compose up -d influxdb grafana

# 스크립트 실행
docker compose run --rm k6 run /scripts/create.js
```

## 대시보드 구성

http://localhost:3000/dashboard/import
> 10660