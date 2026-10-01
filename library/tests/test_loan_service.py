from decimal import Decimal
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from library.models import Author, Book, Category, User, Loan
from library.services.loan_service import LoanService


class LoanServiceTestCase(TestCase):
    def setUp(self):
        self.author = Author.objects.create(name="Gabriel Garcia", birth_year=1927)
        self.category = Category.objects.create(name="Realismo Magico")

        self.book = Book.objects.create(title="Cien años de soledad", price=Decimal("25.50"), stock=5, author=self.author)
        self.book.categories.add(self.category)

        self.user = User.objects.create(name="Jose Luis", money=Decimal("100.00"))
        self.other_user = User.objects.create(name="Juan Marco", money=Decimal("200.00"))

    def test_create_loan_success(self):
        loan = LoanService.create_loan(
            user_id=self.user.id,
            book_id=self.book.id,
            quantity=2
        )

        self.book.refresh_from_db()
        self.user.refresh_from_db()

        self.assertEqual(loan.quantity, 2)
        self.assertEqual(loan.status, Loan.Status.ACTIVE)
        self.assertEqual(loan.user, self.user)
        self.assertEqual(loan.book, self.book)
        self.assertEqual(self.book.stock, 3)
        self.assertEqual(self.user.money, Decimal("49.00"))

    def test_return_loan_success(self):
        loan = LoanService.create_loan(
            user_id=self.user.id,
            book_id=self.book.id,
            quantity=2
        )

        returned_loan = LoanService.return_loan(loan.id)

        self.book.refresh_from_db()
        self.user.refresh_from_db()

        self.assertEqual(returned_loan.status, Loan.Status.RETURNED)
        self.assertEqual(self.book.stock, 5)
        self.assertEqual(self.user.money, Decimal("100.00"))
        self.assertTrue(self.book.is_available)

    def test_create_loan_makes_book_unavailable_when_stock_reaches_zero(self):
        self.user.money = Decimal("200.00")
        self.user.save()
        
        LoanService.create_loan(
            user_id=self.user.id,
            book_id=self.book.id,
            quantity=5
        )

        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 0)
        self.assertFalse(self.book.is_available)

    def test_create_loan_quantity_zero_or_negative(self):
        with self.assertRaises(ValidationError) as ctx:
            LoanService.create_loan(self.user.id, self.book.id, 0)
        self.assertIn("quantity", ctx.exception.detail)

        with self.assertRaises(ValidationError) as ctx:
            LoanService.create_loan(self.user.id, self.book.id, -1)
        self.assertIn("quantity", ctx.exception.detail)

    def test_create_loan_not_enough_stock(self):
        with self.assertRaises(ValidationError) as ctx:
            LoanService.create_loan(self.user.id, self.book.id, 10)
        self.assertIn("quantity", ctx.exception.detail)

    def test_create_loan_not_enough_money(self):
        self.user.money = Decimal("10.00")
        self.user.save()

        with self.assertRaises(ValidationError) as ctx:
            LoanService.create_loan(self.user.id, self.book.id, 1)
        self.assertIn("user", ctx.exception.detail)

    def test_create_loan_book_not_available(self):
        self.book.stock = 0
        self.book.save()

        with self.assertRaises(ValidationError) as ctx:
            LoanService.create_loan(self.user.id, self.book.id, 1)
        self.assertIn("book", ctx.exception.detail)

    def test_create_loan_already_has_active_loan(self):
        LoanService.create_loan(self.user.id, self.book.id, 1)

        with self.assertRaises(ValidationError) as ctx:
            LoanService.create_loan(self.user.id, self.book.id, 1)
        self.assertIn("book", ctx.exception.detail)

    def test_create_loan_user_not_found(self):
        with self.assertRaises(ValidationError):
            LoanService.create_loan(9999, self.book.id, 1)

    def test_create_loan_book_not_found(self):
        with self.assertRaises(ValidationError):
            LoanService.create_loan(self.user.id, 9999, 1)

    def test_return_loan_already_returned(self):
        loan = LoanService.create_loan(self.user.id, self.book.id, 1)
        LoanService.return_loan(loan.id)

        with self.assertRaises(ValidationError) as ctx:
            LoanService.return_loan(loan.id)
        self.assertIn("status", ctx.exception.detail)

    def test_return_loan_not_found(self):
        with self.assertRaises(ValidationError):
            LoanService.return_loan(9999)

    def test_different_users_can_loan_same_book(self):
        loan1 = LoanService.create_loan(self.user.id, self.book.id, 1)
        loan2 = LoanService.create_loan(self.other_user.id, self.book.id, 1)

        self.assertEqual(loan1.status, Loan.Status.ACTIVE)
        self.assertEqual(loan2.status, Loan.Status.ACTIVE)

        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 3)

    def test_user_can_loan_again_after_returning(self):
        loan = LoanService.create_loan(self.user.id, self.book.id, 1)
        LoanService.return_loan(loan.id)

        new_loan = LoanService.create_loan(self.user.id, self.book.id, 1)
        self.assertEqual(new_loan.status, Loan.Status.ACTIVE)

    def test_money_and_stock_consistency_after_multiple_operations(self):
        loan1 = LoanService.create_loan(self.user.id, self.book.id, 2)

        self.user.refresh_from_db()
        self.book.refresh_from_db()
        self.assertEqual(self.user.money, Decimal("49.00"))
        self.assertEqual(self.book.stock, 3)

        loan2 = LoanService.create_loan(self.other_user.id, self.book.id, 1)

        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 2)

        LoanService.return_loan(loan1.id)

        self.user.refresh_from_db()
        self.book.refresh_from_db()
        self.assertEqual(self.user.money, Decimal("100.00"))
        self.assertEqual(self.book.stock, 4)