# 

from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine

# API routers
from app.api import (
    auth,
    events,
    pool,
    categories,
    expenses,
    settlement,
    refunds
)

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cooper – Group Expense & Payment Platform",
    description="Shared expenses with Finternet escrow, voting-based authorization, and wallet refunds",
    version="1.0.0"
)

# ---- Register Routers ----
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(pool.router, prefix="/pool", tags=["Pool"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(settlement.router, prefix="/settlement", tags=["Settlement"])
app.include_router(refunds.router, prefix="/refunds", tags=["Refunds"])


@app.get("/")
def root():
    return {
        "message": "Cooper backend running",
        "docs": "/docs"
    }
