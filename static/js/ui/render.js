import { state, filters } from "../state/state.js";
import { PALETTES } from "../constants/constants.js";
import {
    formatMoney,
    formatDate,
    escapeHtml,
    hashString,
} from "../utils/utils.js";

export function renderStats() {
    const available = state.books.filter((b) => b.stock > 0).length;
    const active = state.loans.filter((l) => l.status === "active").length;
    const copies = state.books.reduce((s, b) => s + b.stock, 0);

    document.getElementById("stat-titles").textContent = String(state.books.length);
    document.getElementById("stat-available").textContent = String(available);
    document.getElementById("stat-loans").textContent = String(active);
    document.getElementById("stat-readers").textContent = String(state.readers.length);
    document.getElementById("catalogo-sub").textContent =
        copies + " ejemplares en sala. Filtra por categoría o disponibilidad.";
}

export function renderCategoryChips() {
    const wrap = document.getElementById("category-chips");
    let html =
        '<button type="button" class="chip' +
        (filters.categoryId === "all" ? " is-active" : "") +
        '" data-category="all" aria-pressed="' +
        (filters.categoryId === "all") +
        '">Todas</button>';

    state.categories.forEach((c) => {
        const active = filters.categoryId === c.id;
        html +=
        '<button type="button" class="chip' +
        (active ? " is-active" : "") +
        '" data-category="' +
        c.id +
        '" aria-pressed="' +
        active +
        '">' +
        escapeHtml(c.name) +
        "</button>";
    });

    wrap.innerHTML = html;
}

function filteredBooks() {
    const needle = filters.query.trim().toLowerCase();

    return state.books.filter((book) => {
        const author = state.authors.find((a) => a.id === book.authorId);
        const cats = book.categoryIds
            .map((id) => {
                const c = state.categories.find((x) => x.id === id);
                
                return c ? c.name : "";
            }).join(" ");

    const hay = (book.title + " " + (author ? author.name : "") + " " + cats).toLowerCase();

    if(needle && hay.indexOf(needle) === -1) return false;
    if(filters.categoryId !== "all" && book.categoryIds.indexOf(filters.categoryId) === -1) return false;
    if(filters.availability === "in" && book.stock <= 0) return false;
    if(filters.availability === "out" && book.stock > 0) return false;

    return true;
  });
}

function bookCoverHtml(book, authorName) {
    const palette = PALETTES[hashString(book.title) % PALETTES.length];
    const initial = (book.title.trim().charAt(0) || "A").toUpperCase();

    return (
        '<div class="book-cover" role="img" aria-label="Portada de ' +
        escapeHtml(book.title) +
        ", de " +
        escapeHtml(authorName) +
        '" style="background:' +
        palette.bg +
        ";color:" +
        palette.fg +
        '">' +
        '<div class="book-cover-spine" style="background:' +
        palette.rule +
        '" aria-hidden="true"></div>' +
        '<div class="book-cover-body">' +
        '<p class="book-cover-initial" aria-hidden="true">' +
        escapeHtml(initial) +
        "</p>" +
        "<div>" +
        '<p class="book-cover-title">' +
        escapeHtml(book.title) +
        "</p>" +
        '<p class="book-cover-author">' +
        escapeHtml(authorName) +
        "</p>" +
        "</div></div></div>"
    );
}

export function renderBooks() {
    const grid = document.getElementById("book-grid");
    const books = filteredBooks();

    if(!books.length) {
        grid.innerHTML = '<p class="empty">No hay títulos con ese criterio.</p>';
        return;
    }

    grid.innerHTML = books
        .map((book) => {
            const author = state.authors.find((a) => a.id === book.authorId);
            const authorName = author ? author.name : "Anónimo";
            const cats = book.categoryIds
            .map((id) => {
            const c = state.categories.find((x) => x.id === id);
            return c ? c.name : null;
            })
            .filter(Boolean);

    const badgeClass = book.stock > 0 ? "badge-available" : "badge-missing";
    const badgeText = book.stock > 0 ? book.stock + " en sala" : "Agotado";

    return (
            '<article class="book-card" aria-labelledby="book-' +
            book.id +
            '-title">' +
            bookCoverHtml(book, authorName) +
            '<div class="book-meta">' +
            '<div class="book-meta-top">' +
            "<div>" +
            '<h3 id="book-' +
            book.id +
            '-title">' +
            escapeHtml(book.title) +
            "</h3>" +
            '<p class="author">' +
            escapeHtml(authorName) +
            "</p>" +
            "</div>" +
            '<span class="badge ' +
            badgeClass +
            '">' +
            badgeText +
            "</span>" +
            "</div>" +
            '<ul class="cat-list" aria-label="Categorías">' +
            cats
            .map((n) => {
                return '<li><span class="badge">' + escapeHtml(n) + "</span></li>";
            })
            .join("") +
            "</ul>" +
            '<p class="price tabular">' +
            formatMoney(book.price) +
            "</p>" +
            '<div class="card-actions">' +
            '<button type="button" class="btn btn-primary" data-action="open-loan" data-book-id="' +
            book.id +
            '"' +
            (book.stock <= 0 ? " disabled" : "") +
            ">Prestar</button>" +
            '<button type="button" class="btn btn-secondary btn-icon" data-action="edit-book" data-id="' +
            book.id +
            '" aria-label="Editar ' +
            escapeHtml(book.title) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
            "</button>" +
            '<button type="button" class="btn btn-ghost btn-icon" data-action="delete" data-kind="book" data-id="' +
            book.id +
            '" data-label="' +
            escapeHtml(book.title) +
            '" aria-label="Eliminar ' +
            escapeHtml(book.title) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
            "</button>" +
            "</div></div></article>"
        );
    }).join("");
}

export function renderAuthors() {
  const grid = document.getElementById("author-grid");

    grid.innerHTML = state.authors
        .map((author) => {
            const titles = state.books.filter((b) => b.authorId === author.id);
            const list = titles.length === 0 ? "Sin títulos en sala" : titles.map((b) => b.title).join(" · ");

    return (
            '<article class="entity-card" aria-labelledby="author-' +
            author.id +
            '">' +
            '<div class="entity-top">' +
            "<div>" +
            '<h3 id="author-' +
            author.id +
            '">' +
            escapeHtml(author.name) +
            "</h3>" +
            '<p class="meta">' +
            author.birthYear +
            "</p>" +
            "</div>" +
            '<div class="entity-actions">' +
            '<button type="button" class="btn btn-ghost btn-icon" data-action="edit-author" data-id="' +
            author.id +
            '" aria-label="Editar ' +
            escapeHtml(author.name) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
            "</button>" +
            '<button type="button" class="btn btn-ghost btn-icon" data-action="delete" data-kind="author" data-id="' +
            author.id +
            '" data-label="' +
            escapeHtml(author.name) +
            '" aria-label="Eliminar ' +
            escapeHtml(author.name) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
            "</button>" +
            "</div></div>" +
            '<p class="meta" style="margin-top:0.75rem">' +
            escapeHtml(list) +
            "</p></article>"
        );
    }).join("");
}

export function renderReaders() {
    const grid = document.getElementById("reader-grid");

    grid.innerHTML = state.readers
        .map((reader) => {
            const active = state.loans.filter(
            (l) => l.userId === reader.id && l.status === "active"
        ).length;

    return (
            '<article class="entity-card" aria-labelledby="reader-' +
            reader.id +
            '">' +
            '<div class="entity-top">' +
            "<div>" +
            '<h3 id="reader-' +
            reader.id +
            '">' +
            escapeHtml(reader.name) +
            "</h3>" +
            '<p class="meta tabular">Saldo ' +
            formatMoney(reader.money) +
            "</p>" +
            "</div>" +
            '<span class="badge ' +
            (active ? "badge-active" : "") +
            '">' +
            active +
            " activos</span>" +
            "</div>" +
            '<div class="entity-actions-row">' +
            '<button type="button" class="btn btn-secondary" data-action="open-loan">Prestar</button>' +
            '<button type="button" class="btn btn-ghost btn-icon" data-action="edit-reader" data-id="' +
            reader.id +
            '" aria-label="Editar ' +
            escapeHtml(reader.name) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
            "</button>" +
            '<button type="button" class="btn btn-ghost btn-icon" data-action="delete" data-kind="reader" data-id="' +
            reader.id +
            '" data-label="' +
            escapeHtml(reader.name) +
            '" aria-label="Eliminar ' +
            escapeHtml(reader.name) +
            '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
            "</button>" +
            "</div></article>"
        );
    }).join("");
}

export function renderLoans() {
    const list = document.getElementById("loan-list");

    if(!state.loans.length) {
        list.innerHTML = '<li><p class="empty">Todavía no hay préstamos.</p></li>';
        return;
    }

    list.innerHTML = state.loans
        .map((loan) => {
            const book = state.books.find((b) => b.id === loan.bookId);
            const reader = state.readers.find((r) => r.id === loan.userId);
            const total = book ? book.price * loan.quantity : 0;
            const title = book ? book.title : "Título eliminado";

    const badge =
        loan.status === "active"
            ? '<span class="badge badge-active">Activo</span>'
            : '<span class="badge badge-returned">Devuelto</span>';

    const action =
        loan.status === "active"
            ? '<button type="button" class="btn btn-secondary" data-action="return" data-id="' +
                loan.id +
                '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>' +
                " Devolver</button>"
            : '<button type="button" class="btn btn-ghost" data-action="delete" data-kind="loan" data-id="' +
                loan.id +
                '" data-label="' +
                escapeHtml(title) +
                '">Eliminar</button>';

    return (
            '<li><article class="loan-card" aria-labelledby="loan-' +
            loan.id +
            '">' +
            "<div>" +
            '<h3 id="loan-' +
            loan.id +
            '">' +
            escapeHtml(title) +
            "</h3>" +
            '<p class="meta">' +
            escapeHtml(reader ? reader.name : "Lector") +
            " · " +
            loan.quantity +
            (loan.quantity === 1 ? " ejemplar" : " ejemplares") +
            " · " +
            formatMoney(total) +
            " · " +
            formatDate(loan.createdAt) +
            "</p></div>" +
            '<div class="loan-actions">' +
            badge +
            action +
            "</div></article></li>"
        );
    }).join("");
}

export function renderAll() {
    renderStats();
    renderCategoryChips();
    renderBooks();
    renderAuthors();
    renderReaders();
    renderLoans();
}