from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.event import Event
from app.models.participant import Participant

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/")
def create_event(title: str, organizer_id: int, db: Session = Depends(get_db)):
    event = Event(title=title)
    db.add(event)
    db.commit()
    db.refresh(event)

    participant = Participant(
        event_id=event.id,
        user_id=organizer_id
    )
    db.add(participant)
    db.commit()

    # 🔥 THIS RETURN IS REQUIRED
    return {
        "id": event.id,
        "title": event.title,
        "organizer_id": organizer_id
    }

@router.post("/{event_id}/participants")
def add_participant(event_id: int, user_id: int, db: Session = Depends(get_db)):
    # Check if already exists to avoid duplicates/errors
    existing = db.query(Participant).filter_by(event_id=event_id, user_id=user_id).first()
    if not existing:
        participant = Participant(event_id=event_id, user_id=user_id)
        db.add(participant)
        db.commit()
    return {"status": "added", "user_id": user_id}

@router.get("/{event_id}/participants")
def get_participants(event_id: int, db: Session = Depends(get_db)):
    participants = db.query(Participant).filter_by(event_id=event_id).all()
    return [p.user_id for p in participants]
