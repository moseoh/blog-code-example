from sqlalchemy.orm import Session
from app import models, schemas

def get_board(db: Session, board_id: int):
    return db.query(models.Board).filter(models.Board.id == board_id).first()

def get_boards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Board).offset(skip).limit(limit).all()

def create_board(db: Session, board: schemas.BoardCreate):
    db_board = models.Board(title=board.title, content=board.content)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

def get_latest_board(db: Session):
    return db.query(models.Board).order_by(models.Board.id.desc()).first() 