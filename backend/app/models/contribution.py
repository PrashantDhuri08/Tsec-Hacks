from sqlalchemy import Column, Integer, Float, ForeignKey
from app.db.base import Base

class Contribution(Base):
    __tablename__ = "contributions"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer)
    amount = Column(Float)
