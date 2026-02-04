def is_approved(event_id, candidate_user_id, db):
    active_members = db.query("participants").count()
    approvals = db.query("membership_votes").filter_by(
        event_id=event_id,
        candidate_user_id=candidate_user_id,
        approve=True
    ).count()

    return approvals >= (active_members // 2 + 1)
