from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine) # 데이터베이스 테이블 생성 (개발용, 실제 운영에서는 Alembic 권장)

router = APIRouter(
    prefix="/api/boards",
    tags=["boards"],
)

@router.post("/", response_model=schemas.Board, status_code=201)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    return crud.create_board(db=db, board=board)

@router.get("/", response_model=List[schemas.Board])
def read_boards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    boards = crud.get_boards(db, skip=skip, limit=limit)
    return boards

@router.get("/latest", response_model=schemas.Board)
def read_latest_board(db: Session = Depends(get_db)):
    db_board = crud.get_latest_board(db=db)
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return db_board

@router.get("/{board_id}", response_model=schemas.Board)
def read_board(board_id: int, db: Session = Depends(get_db)):
    db_board = crud.get_board(db, board_id=board_id)
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return db_board 