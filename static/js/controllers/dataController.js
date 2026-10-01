import { setState } from "../state/state.js";
import { renderAll } from "../ui/render.js";
import {
    authorsApi,
    categoriesApi,
    booksApi,
    usersApi,
    loansApi,
} from "../api/api.js";

export async function reloadData() {
    const [authors, categories, books, users, loans] = await Promise.all([
        authorsApi.list(),
        categoriesApi.list(),
        booksApi.list(),
        usersApi.list(),
        loansApi.list(),
    ]);

    setState({
        authors: authors.map((a) => ({
            id: a.id,
            name: a.name,
            birthYear: a.birth_year,
        })),

        categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
        })),

        books: books.map((b) => ({
            id: b.id,
            title: b.title,
            price: Number(b.price),
            stock: b.stock,
            authorId: b.author,
            categoryIds: b.categories || [],
            createdAt: b.created_at,
        })),
            
            readers: users.map((u) => ({
            id: u.id,
            name: u.name,
            money: Number(u.money),
        })),
            
            loans: loans.map((l) => ({
            id: l.id,
            userId: l.user,
            bookId: l.book,
            quantity: l.quantity,
            status: l.status,
            createdAt: l.created_at,
        })),
    });

    renderAll();  
}