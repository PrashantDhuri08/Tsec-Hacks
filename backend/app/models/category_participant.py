from sqlalchemy import Column, Integer, ForeignKey
from app.db.base import Base

class CategoryParticipant(Base):
    __tablename__ = "category_participants"
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer)
