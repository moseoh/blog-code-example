from pydantic import BaseModel
from typing import Optional

class BoardBase(BaseModel):
    title: str
    content: str

class BoardCreate(BoardBase):
    pass

class Board(BoardBase):
    id: int

    class Config:
        from_attributes = True  # SQLAlchemy 모델과 호환되도록 설정 (Pydantic V2 방식)
        # Pydantic V2에서는 from_attributes = True 사용
        # from_attributes = True 