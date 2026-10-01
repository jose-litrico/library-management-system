from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status 
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from .services.loan_service import LoanService

from .models import (
    Author,
    Book,
    Category,
    Loan,
    User
)

from .serializers import (
    AuthorSerializer,
    BookSerializer,
    CategorySerializer,
    LoanSerializer,
    UserSerializer
)

class AuthorListCreateView(APIView):
    def get(self, request):
        authors = Author.objects.prefetch_related("books").all()

        serializers = AuthorSerializer(authors, many=True)

        return Response(serializers.data)

    def post(self, request):
        serializer = AuthorSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class AuthorDetailView(APIView):
    def put(self, request, author_id: int):
        author = get_object_or_404(Author, pk=author_id)

        serializer = AuthorSerializer(author, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request, author_id: int):
        author = get_object_or_404(Author, pk=author_id)

        serializer = AuthorSerializer(author)

        return Response(serializer.data)

    def delete(self, request, author_id: int):
        author = get_object_or_404(Author, pk=author_id)

        author.delete()

        return Response(
            {"message": "Author deleted"},
            status=status.HTTP_200_OK
        )

class CategoryListCreateView(APIView):
    def get(self, request):
        categories = Category.objects.all()

        serializers = CategorySerializer(categories, many=True)

        return Response(serializers.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class CategoryDetailView(APIView):
    def put(self, request, category_id: int):
        category = get_object_or_404(Category, pk=category_id)

        serializer = CategorySerializer(category, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request, category_id: int):
        category = get_object_or_404(Category, pk=category_id)
        
        serializer = CategorySerializer(category)

        return Response(serializer.data)

    def delete(self, request, category_id: int):
        category = get_object_or_404(Category, pk=category_id)

        category.delete()

        return Response(
            {"message": "Category deleted"},
            status=status.HTTP_200_OK
        )

class BookListCreateView(APIView):
    def get(self, request):
        books = Book.objects.select_related("author").prefetch_related("categories").all()

        serializers = BookSerializer(books, many=True)

        return Response(serializers.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class BookDetailView(APIView):
    def put(self, request, book_id: int):
        book = get_object_or_404(Book, pk=book_id)

        serializer = BookSerializer(book, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request, book_id: int):
        book = get_object_or_404(Book.objects.select_related("author").prefetch_related("categories"), pk=book_id)

        serializer = BookSerializer(book)

        return Response(serializer.data)

    def delete(self, request, book_id: int):
        book = get_object_or_404(Book, pk=book_id)

        book.delete()

        return Response(
            {"message": "Book deleted"},
            status=status.HTTP_200_OK
        )

class LoanListCreateView(APIView):
    def get(self, request):
        loans = Loan.objects.select_related("user", "book").all()

        serializers = LoanSerializer(loans, many=True)

        return Response(serializers.data)

    def post(self, request):
        user_id = request.data.get("user")
        book_id = request.data.get("book")
        quantity = request.data.get("quantity")

        if not all([user_id, book_id, quantity]):
            return Response(
                {"error": "User, book and quantity are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            loan = LoanService.create_loan(
                user_id=int(user_id),
                book_id=int(book_id),
                quantity=int(quantity)
            )

            serializer = LoanSerializer(loan)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return Response(
                e.detail, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except (ValueError, TypeError):
            return Response(
                {"error": "User, book and quantity must be numbers"},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoanDetailView(APIView):
    def get(self, request, loan_id: int):
        loan = get_object_or_404(Loan.objects.select_related("user", "book"), pk=loan_id)

        serializer = LoanSerializer(loan)

        return Response(serializer.data)

    def delete(self, request, loan_id: int):
        loan = get_object_or_404(Loan, pk=loan_id)

        if loan.status == Loan.Status.ACTIVE:
            return Response(
                {"error": "Cannot delete an active loan. Return it first"},
                status=status.HTTP_400_BAD_REQUEST
            )

        loan.delete()

        return Response(
            {"message": "Loan deleted"},
            status=status.HTTP_200_OK
        )

class LoanReturnView(APIView):
    def post(self, request, loan_id: int):
        try:
            loan = LoanService.return_loan(loan_id)

            serializer = LoanSerializer(loan)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(    
                e.detail,
                status=status.HTTP_400_BAD_REQUEST
            )

class UserListCreateView(APIView):
    def get(self, request):
        user = User.objects.all()

        serializers = UserSerializer(user, many=True)

        return Response(serializers.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED    
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class UserDetailView(APIView):
    def put(self, request, user_id: int):
        user = get_object_or_404(User, pk=user_id)

        serializer = UserSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request, user_id: int):
        user = get_object_or_404(User, pk=user_id)

        serializer = UserSerializer(user)

        return Response(serializer.data)

    def delete(self, request, user_id: int):
        user = get_object_or_404(User, pk=user_id)

        user.delete()

        return Response(
            {"message": "User deleted"},
            status=status.HTTP_200_OK
        )