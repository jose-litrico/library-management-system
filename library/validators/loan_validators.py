from rest_framework.exceptions import ValidationError

from ..models import Book, User, Loan

def validate_loan_creation(user: User, book: Book, quantity: int):
    if quantity is None or quantity <= 0:
        raise ValidationError({"quantity": "The amount must be greater than 0."})

    if not book.is_available:
        raise ValidationError({"book": "The book is not available"})

    if book.stock < quantity:
        raise ValidationError({"quantity": f"There is not enough stock, Available: {book.stock}"})

    total_price = book.price * quantity

    if user.money < total_price:
        raise ValidationError({"user": f"The user does not have enough money. Needs: {total_price} and has {user.money}"})

    active_loan = Loan.objects.filter(
        user=user,
        book=book,
        status=Loan.Status.ACTIVE
    ).exists()

    if active_loan:
        raise ValidationError({"book": "You already have an active loan for this book"})

def validate_loan_return(loan: Loan):
    if loan.status == Loan.Status.RETURNED:
        raise ValidationError({"status": "This loan has already been returned"})

    if loan.status != Loan.Status.ACTIVE:
        raise ValidationError({"status": "Only active loans can be returned"})