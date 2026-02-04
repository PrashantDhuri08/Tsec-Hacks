from app.models.contribution import Contribution
from app.models.expense_split import ExpenseSplit

from sqlalchemy import text as sql_text

def calculate_settlement(db, event_id):
    paid = {}
    owed = {}

    for c in db.query(Contribution).filter_by(event_id=event_id):
        paid[c.user_id] = paid.get(c.user_id, 0) + c.amount

    splits = db.execute(sql_text("""
        SELECT expense_splits.user_id, SUM(expense_splits.share)
        FROM expense_splits
        JOIN expenses ON expenses.id = expense_splits.expense_id
        WHERE expenses.event_id = :eid
        GROUP BY expense_splits.user_id
    """), {"eid": event_id})

    for uid, amt in splits:
        owed[uid] = amt

    return {
        uid: paid.get(uid, 0) - owed.get(uid, 0)
        for uid in owed
    }
