import random
from decimal import Decimal

def generate_amount():
    amount = random.uniform(1000.00, 2000.00)

    return Decimal(str(round(amount, 2)))