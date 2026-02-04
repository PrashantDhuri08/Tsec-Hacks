def validate_payment(amount, rule):
    if rule and amount > rule.max_amount:
        raise Exception("Amount exceeds rule limit")
