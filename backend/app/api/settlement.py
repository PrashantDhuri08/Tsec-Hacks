from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.settlement import calculate_settlement

router = APIRouter(prefix="/settlement")

@router.get("/{event_id}")
def settle(event_id: int, db: Session = Depends(get_db)):
    return calculate_settlement(db, event_id)
