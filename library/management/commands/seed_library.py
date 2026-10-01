from decimal import Decimal
from django.core.management.base import BaseCommand
from library.models import Author, Category, Book, User, Loan


class Command(BaseCommand):
    help = "Carga datos de muestra de Ateneo"

    def handle(self, *args, **options):
        if Book.objects.exists():
            self.stdout.write(self.style.WARNING("Ya hay datos. No se vuelve a cargar."))
            return

        authors_data = [
            ("Gabriel García Márquez", 1927),
            ("Jorge Luis Borges", 1899),
            ("Clarice Lispector", 1920),
            ("Julio Cortázar", 1914),
            ("Isabel Allende", 1942),
            ("Roberto Bolaño", 1953),
            ("Elena Poniatowska", 1932),
            ("Mario Vargas Llosa", 1936),
        ]
        authors = [
            Author.objects.create(name=name, birth_year=year)
            for name, year in authors_data
        ]

        cat_names = ["Realismo mágico", "Cuento", "Novela", "Crónica", "Ensayo"]
        categories = [Category.objects.create(name=n) for n in cat_names]

        books_data = [
            ("Cien años de soledad", "25.50", 5, 0, [0, 2]),
            ("Ficciones", "18.00", 4, 1, [1, 4]),
            ("La hora de la estrella", "14.75", 3, 2, [2]),
            ("Rayuela", "22.00", 2, 3, [2]),
            ("La casa de los espíritus", "19.90", 6, 4, [0, 2]),
            ("Los detectives salvajes", "27.00", 1, 5, [2]),
            ("La noche de Tlatelolco", "16.50", 4, 6, [3]),
            ("La ciudad y los perros", "21.00", 0, 7, [2]),
            ("El amor en los tiempos del cólera", "23.40", 3, 0, [0, 2]),
            ("El Aleph", "17.25", 5, 1, [1]),
        ]

        for title, price, stock, author_idx, cat_idxs in books_data:
            book = Book.objects.create(
                title=title,
                price=Decimal(price),
                stock=stock,
                author=authors[author_idx],
            )
            book.categories.set([categories[i] for i in cat_idxs])

        users = [
            User.objects.create(name="José Luis", money=Decimal("100.00")),
            User.objects.create(name="Juan Marco", money=Decimal("200.00")),
            User.objects.create(name="Ana María Ríos", money=Decimal("150.00")),
            User.objects.create(name="Lucía Herrera", money=Decimal("80.00")),
        ]

        rayuela = Book.objects.get(title="Rayuela")
        ficciones = Book.objects.get(title="Ficciones")

        Loan.objects.create(
            user=users[2],
            book=rayuela,
            quantity=1,
            status=Loan.Status.ACTIVE,
        )
        rayuela.stock -= 1
        rayuela.save()
        users[2].money -= rayuela.price
        users[2].save()

        Loan.objects.create(
            user=users[1],
            book=ficciones,
            quantity=1,
            status=Loan.Status.RETURNED,
        )

        self.stdout.write(self.style.SUCCESS("Catálogo de muestra cargado."))