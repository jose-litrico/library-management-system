from rest_framework.exceptions import ValidationError

def validate_book(stock: int):
    if stock is None or stock < 0:
        raise ValidationError({"stock": "The stock must be not negative"})

def validate_book_price(price: int):
    if price is None or price <= 0:
        raise ValidationError({"price": "The price must be greater than 0."})