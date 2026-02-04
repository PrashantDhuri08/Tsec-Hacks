from sqlalchemy import Column, Integer, Float, ForeignKey
from app.db.base import Base

class ExpenseSplit(Base):
    __tablename__ = "expense_splits"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    user_id = Column(Integer)
    share = Column(Float)
