from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.db.base import Base

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    amount = Column(Float)
    payment_intent_id = Column(String)
