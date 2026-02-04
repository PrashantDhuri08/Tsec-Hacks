from sqlalchemy import Column, Integer, Boolean
from app.db.base import Base

class MembershipVote(Base):
    __tablename__ = "membership_votes"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    candidate_user_id = Column(Integer)
    voter_user_id = Column(Integer)
    approve = Column(Boolean)

def check_membership_approval(event_id, candidate_id, db):
    total_members = db.query(Participant)\
        .filter_by(event_id=event_id, is_active=True)\
        .count()

    approvals = db.query(MembershipVote)\
        .filter_by(
            event_id=event_id,
            candidate_user_id=candidate_id,
            approve=True
        ).count()

    return approvals >= (total_members // 2 + 1)

