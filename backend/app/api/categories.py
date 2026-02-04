from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.category import Category
from app.models.category_participant import CategoryParticipant

router = APIRouter(prefix="/categories")

@router.post("/")
def create_category(event_id: int, name: str, db: Session = Depends(get_db)):
    cat = Category(event_id=event_id, name=name)
    db.add(cat)
    db.commit()
    return cat

@router.get("/")
def get_categories(event_id: int, db: Session = Depends(get_db)):
    return db.query(Category).filter_by(event_id=event_id).all()

@router.post("/{category_id}/join")
def join(category_id: int, user_id: int, db: Session = Depends(get_db)):
    db.add(CategoryParticipant(category_id=category_id, user_id=user_id))
    db.commit()
    return {"status": "joined"}
