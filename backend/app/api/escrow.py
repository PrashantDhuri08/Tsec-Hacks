from fastapi import APIRouter
from app.services.finternet_client import FinternetClient

router = APIRouter(prefix="/escrow", tags=["Escrow"])
finternet = FinternetClient()

@router.get("/{intent_id}")
def get_escrow(intent_id: str):
    return finternet.get_escrow(intent_id)
