from sqlalchemy import Column, Integer, ForeignKey
from app.db.base import Base

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer)
