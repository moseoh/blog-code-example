from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = FastAPI()

# CORS 설정
origins = os.getenv("CORS_ALLOW_ORIGINS").split(",")
allow_credentials = os.getenv("CORS_ALLOW_CREDENTIALS") == "true"
allow_methods = os.getenv("CORS_ALLOW_METHODS").split(",")
allow_headers = os.getenv("CORS_ALLOW_HEADERS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=allow_methods,
    allow_headers=allow_headers,
)


class CookieRequest(BaseModel):
    key: str
    value: str
    domain: str
    path: str
    secure: bool
    httponly: bool
    samesite: str


@app.post("/set-cookie")
def set_cookie(data: CookieRequest, response: Response):
    response.set_cookie(
        key=data.key,
        value=data.value,
        domain=data.domain,
        path=data.path,
        secure=data.secure,
        httponly=data.httponly,
        samesite=data.samesite
    )
    return {"message": "쿠키가 설정되었습니다"}


@app.get("/get-cookies")
def get_cookies(request: Request):
    cookies = request.cookies
    return {"cookies": cookies}
