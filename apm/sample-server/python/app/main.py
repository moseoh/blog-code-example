from fastapi import FastAPI

from app.routers import board

app = FastAPI()

app.include_router(board.router)

@app.get("/")
def read_root():
    return {"message": "Sample FastAPI server is running"} 