# MCP

## 설치

```json
{
  "mcpServers": {
    "sequentialthinking": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/sequentialthinking"]
    },
    "weather": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "weather-mcp"]
    },
    "filesystem": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--mount",
        "type=bind,src=/Users/seongha.moon/code/development/blog-code-example/mcp/data,dst=/projects/data",
        "filesystem-mcp",
        "/projects"
      ]
    }
  }
}
```

```shell
cd filesystem
docker build -t filesystem-mcp .
```

./data 폴더에 파일 추가

## 질문

사용자 수술 마취 기록은 어떻게 확인하지? filesystem-mcp를 활용하여 pdf 파일에서 찾아봐
환자의 마취기록을 실행하려면 어떻게해?

## ollama 로 실행

```shell
docker compose up -d
docker exec -it ollama ollama pull gemma3:1b
docker exec -it ollama ollama run gemma3:1b
```

cursor > models > http://localhost:11434/v1
api 키 아무거나
models gemma3:1b

참조:\
https://changsroad.tistory.com/550
