from sqlalchemy import Column, Integer, DateTime
from app.db.base import Base

class RefundRule(Base):
    __tablename__ = "refund_rules"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    refund_after = Column(DateTime)
