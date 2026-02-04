from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.db.base import Base

class PaymentIntent(Base):
    __tablename__ = "payment_intents"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    intent_id = Column(String, unique=True)
    amount = Column(Float)
    currency = Column(String)
    status = Column(String)
