from decimal import Decimal
from django.db import transaction
from rest_framework.exceptions import ValidationError

from ..models import Loan, Book, User
from ..validators.loan_validators import validate_loan_creation, validate_loan_return

class LoanService:
    @staticmethod
    @transaction.atomic
    def create_loan(user_id: int, book_id: int, quantity:int) -> Loan:
        try:
            user = User.objects.select_for_update().get(pk=user_id)
            book = Book.objects.select_for_update().get(pk=book_id)
        except User.DoesNotExist:
            raise ValidationError({"user": "User not found"})
        except Book.DoesNotExist:
            raise ValidationError({"book": "Book not found"})

        validate_loan_creation(user, book, quantity)

        total_price = book.price * quantity

        book.stock -= quantity
        book.save()

        user.money -= total_price
        user.save()

        loan = Loan.objects.create(user=user, book=book, quantity=quantity, status=Loan.Status.ACTIVE)

        return loan

    @staticmethod
    @transaction.atomic
    def return_loan(loan_id: int) -> Loan:
        try:
            loan = Loan.objects.select_for_update().select_related("book", "user").get(pk=loan_id)
        except Loan.DoesNotExist:
            raise ValidationError({"loan": "Loan not found"})

        validate_loan_return(loan)

        book = loan.book
        user = loan.user

        book.stock += loan.quantity
        book.save()

        refund = book.price * loan.quantity
        user.money += refund
        user.save()

        loan.status = Loan.Status.RETURNED
        loan.save()

        return loan