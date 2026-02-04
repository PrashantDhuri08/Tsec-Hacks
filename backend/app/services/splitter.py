from app.models.expense_split import ExpenseSplit

def split_equally(db, expense_id, amount, user_ids):
    if not user_ids:
        return
    share = amount / len(user_ids)
    for uid in user_ids:
        db.add(ExpenseSplit(
            expense_id=expense_id,
            user_id=uid,
            share=share
        ))
    db.commit()
