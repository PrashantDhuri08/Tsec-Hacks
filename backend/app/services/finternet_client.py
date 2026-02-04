import requests
from app.core.config import settings

HEADERS = {
    "Content-Type": "application/json",
    "X-API-Key": settings.FINTERNET_API_KEY
}

class FinternetClient:
    def create_payment_intent(
        self,
        amount: float,
        currency: str = "INR",
        destination: str = "9876543210"
    ):
        payload = {
            "amount": f"{amount:.2f}",
            "currency": currency,
            "type": "DELIVERY_VS_PAYMENT",
            "settlementMethod": "OFF_RAMP_TO_RTP",
            "settlementDestination": destination,
            "metadata": {
                "releaseType": "MILESTONE_LOCKED"
            }
        }

        res = requests.post(
            f"{settings.FINTERNET_BASE_URL}/api/v1/payment-intents",
            json=payload,
            headers=HEADERS,
            timeout=15
        )

        res.raise_for_status()
        return res.json()["data"]
