from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.finternet_client import FinternetClient
from app.services.splitter import split_equally
from app.models.expense import Expense
from app.models.category_participant import CategoryParticipant

router = APIRouter(prefix="/expenses", tags=["Expenses"])
finternet = FinternetClient()

@router.post("/")
def create_expense(
    event_id: int,
    category_id: int,
    amount: float,
    db: Session = Depends(get_db)
):
    # 1️⃣ Create Finternet payment intent (CORRECT BODY)
    intent = finternet.create_payment_intent(amount=amount)

    # 2️⃣ Save expense
    expense = Expense(
        event_id=event_id,
        category_id=category_id,
        amount=amount,
        payment_intent_id=intent["id"]
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    # 3️⃣ Split expense internally
    users = [
        cp.user_id
        for cp in db.query(CategoryParticipant)
        .filter_by(category_id=category_id)
        .all()
    ]

    split_equally(db, expense.id, amount, users)

    # 4️⃣ Return payment URL
    return {
        "intent_id": intent["id"],
        "payment_url": intent["paymentUrl"],
        "status": intent["status"]
    }
