from django.urls import path

from .views import (
    AuthorListCreateView,
    AuthorDetailView,
    CategoryListCreateView,
    CategoryDetailView,
    BookListCreateView,
    BookDetailView,
    LoanListCreateView,
    LoanDetailView,
    LoanReturnView,
    UserListCreateView,
    UserDetailView
)

urlpatterns = [
    path("authors/", AuthorListCreateView.as_view(), name="author-list-create"),
    path("authors/<int:author_id>/", AuthorDetailView.as_view(), name="author-detail"),
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:category_id>/", CategoryDetailView.as_view(), name="category-detail"),
    path("books/", BookListCreateView.as_view(), name="book-list-create"),
    path("books/<int:book_id>/", BookDetailView.as_view(), name="book-detail"),
    path("loans/", LoanListCreateView.as_view(), name="loan-list-create"),
    path("loans/<int:loan_id>/", LoanDetailView.as_view(), name="loan-detail"),
    path("loans/<int:loan_id>/return/", LoanReturnView.as_view(), name="loan-return"),
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
    path("users/<int:user_id>/", UserDetailView.as_view(), name="user-detail"),
]