from rest_framework import serializers
from django.core.validators import MinValueValidator

from .models import (
    Book,
    Category,
    Author,
    Loan,
    User
)

class BookSerializer(serializers.ModelSerializer):
    stock = serializers.IntegerField(validators=[MinValueValidator(0)])

    price = serializers.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0.01, message="The price must be greater than 0.0")])

    class Meta:
        model = Book
        fields = "__all__"

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"

class LoanSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(validators=[MinValueValidator(1, message="The amount must be greater than 0")])

    class Meta:
        model = Loan
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"