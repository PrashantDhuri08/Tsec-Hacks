# services/auth.py
import hashlib

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hash):
    return hash_password(password) == hash


def credit_wallet(user, amount):
    user.wallet_balance += amount

def debit_wallet(user, amount):
    if user.wallet_balance < amount:
        raise Exception("Insufficient balance")
    user.wallet_balance -= amount
