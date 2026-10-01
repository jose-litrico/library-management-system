from django.db import models

from .utils.utils import generate_amount

class Author(models.Model):
    name = models.CharField(max_length=30)
    birth_year = models.PositiveIntegerField()

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField()
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,
        related_name="books"
    )
    categories = models.ManyToManyField(
        Category,
        related_name="books"
    )
    @property
    def is_available(self):
        return self.stock > 0
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
    
class User(models.Model):
    name = models.CharField(max_length=40)
    money = models.DecimalField(max_digits=6, decimal_places=2, default=generate_amount)

    def __str__(self):
        return self.name

class Loan(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        RETURNED = "returned", "Returned"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="loans"
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name="loans"
    )
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=8, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} - {self.user.name} ({self.status})"