from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contribution import Contribution

router = APIRouter(prefix="/pool")

@router.post("/deposit")
def deposit(event_id: int, user_id: int, amount: float, db: Session = Depends(get_db)):
    db.add(Contribution(event_id=event_id, user_id=user_id, amount=amount))
    db.commit()
    return {"status": "deposited"}

@router.get("/{event_id}/balance")
def get_balance(event_id: int, db: Session = Depends(get_db)):
    contributions = db.query(Contribution).filter_by(event_id=event_id).all()
    total = sum(c.amount for c in contributions)
    return {"balance": total}
