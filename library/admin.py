from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Author,
    Book,
    Category,
    Loan,
    User
)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "price", "stock", "categoriesList", "created_at", )

    search_fields = ("title", "author__name")

    list_filter = ("author", "categories", )

    ordering = ("-created_at", )

    filter_horizontal = ("categories", )

    readonly_fields = ("created_at", )

    fieldsets = (
        (
            "Information",
            {
                "fields": (
                    "title",
                    "author",
                    "categories",
                )
            },
        ), (
            "Inventory",
            {
                "fields": (
                    "price",
                    "stock",
                )
            },
        ), (
            "Metadata",
            {
                "fields": (
                    "created_at",
                ),
                "classes": (
                    "collapse",
                )
            },
        ),
    )

    @admin.display(description="Categories")
    def categoriesList(self, obj):
        return ", ".join(category.name for category in obj.categories.all())

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "birth_year", "books_count", )

    search_fields = ("name", )

    list_filter = ("birth_year", )

    ordering = ("-birth_year", "name", )

    fieldsets = (
        (
            "Information",
            {
                "fields": (
                    "name",
                    "birth_year",
                )
            },
        ),
    )

    def books_count(self, obj):
        return obj.books.count()
    books_count.short_description = "Books"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "books_count", )

    search_fields = ("name", )

    list_filter = ("name", )

    ordering = ("name", )

    fieldsets = (
        (
            "Information", 
            {
                "fields": (
                    "name",
                )
            },
        ),
    )

    def books_count(self, obj):
        return obj.books.count()
    books_count.short_description = "Books"

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "money", "active_loans_count", "total_loans_count")

    search_fields = ("name", )

    list_filter = ("money", )

    ordering = ("name", )

    fieldsets = (
        (
            "Information",
            {
                "fields": (
                    "name",
                    "money",
                )
            },
        ),
    )

    def active_loans_count(self, obj):
        return obj.loans.filter(status="active").count()
    active_loans_count.short_description = "Active Loans"

    def total_loans_count(self, obj):
        return obj.loans.count()
    total_loans_count.short_description = "Total Loans"

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "quantity", "created_at", "status_colored", "total_price" )

    search_fields = ("user__name", "book__title", )

    list_filter = ("status", "created_at", )

    readonly_fields = ("created_at", "total_price_display", )

    ordering = ("-created_at", )

    fieldsets = (
        (
            "Information",
            {
                "fields": (
                    "user",
                    "book",
                    "quantity",
                )
            },
        ), (
            "Status",
            {
                "fields": (
                    "status",
                )
            },
        ), (
            "Details", 
            {
                "fields": (
                    "created_at",
                    "total_price_display",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    def total_price(self, obj):
        return obj.book.price * obj.quantity

    total_price.short_description = "Total"

    def total_price_display(self, obj):
        return f"${obj.book.price * obj.quantity}"

    total_price_display.short_description = "Total Price"

    def status_colored(self, obj):
        color = {
            "active": "orange",
            "returned": "green",
        }.get(obj.status, "black")

        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )   
    status_colored.short_description = "Status"