from datetime import datetime
from app.services.settlement import calculate_settlement

def process_refunds(event_id, db):
    rule = db.query("refund_rules").filter_by(event_id=event_id).first()
    if not rule or datetime.utcnow() < rule.refund_after:
        return

    balances = calculate_settlement(db, event_id)

    for user_id, balance in balances.items():
        if balance > 0:
            user = db.query("users").get(user_id)
            user.wallet_balance += balance

    db.commit()
