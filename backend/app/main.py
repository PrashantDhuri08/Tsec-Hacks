from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.api import events, pool, categories, expenses, settlement

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cooper – Shared Expense Platform")

app.include_router(events.router)
app.include_router(pool.router)
app.include_router(categories.router)
app.include_router(expenses.router)
app.include_router(settlement.router)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
