import {
  state,
  pendingReturnId,
  pendingDelete,
  lastFocus,
  setLastFocus,
  setPendingReturnId,
  setPendingDelete,
} from "../state/state.js";
import { formatMoney, escapeHtml } from "../utils/utils.js";

export function openDialog(id) {
  setLastFocus(document.activeElement);
  const backdrop = document.getElementById(id);
  backdrop.classList.add("is-open");
  const focusable = backdrop.querySelector("input, select, button:not([data-close])");
  if (focusable) focusable.focus();
  document.body.style.overflow = "hidden";
}

export function closeDialogs() {
    document.querySelectorAll(".dialog-backdrop.is-open").forEach((el) => {
        el.classList.remove("is-open");
    });
    document.body.style.overflow = "";
    if(lastFocus && lastFocus.focus) lastFocus.focus();
}

export function clearErrors(form) {
    form.querySelectorAll(".error").forEach((el) => {
        el.hidden = true;
        el.textContent = "";
    });
}

export function showError(id, message) {
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = message;
    el.hidden = false;
}

export function fillLoanForm(bookId) {
    const userSelect = document.getElementById("loan-user");
    const bookSelect = document.getElementById("loan-book");

    userSelect.innerHTML =
        '<option value="">Selecciona un lector</option>' +
        state.readers
            .map((r) => {
                return (
                '<option value="' +
                r.id +
                '">' +
                escapeHtml(r.name) +
                " · " +
                formatMoney(r.money) +
                "</option>"
                );
            }).join("");

    bookSelect.innerHTML =
        '<option value="">Selecciona un libro</option>' +
        state.books
            .map((b) => {
                const a = state.authors.find((x) => x.id === b.authorId);

                return (
                '<option value="' +
                b.id +
                '">' +
                escapeHtml(b.title) +
                " — " +
                escapeHtml(a ? a.name : "Autor") +
                " (" +
                b.stock +
                " en sala)</option>"
                );
            }).join("");

    if(state.readers[0]) userSelect.value = String(state.readers[0].id);

    if(bookId) {
        bookSelect.value = String(bookId);
    }else {
        const first = state.books.find((b) => b.stock > 0);
        if (first) bookSelect.value = String(first.id);
    }

    document.getElementById("loan-quantity").value = "1";
    clearErrors(document.getElementById("loan-form"));
    updateLoanSummary();
}

export function updateLoanSummary() {
    const bookId = Number(document.getElementById("loan-book").value);
    const userId = Number(document.getElementById("loan-user").value);
    const qty = Number(document.getElementById("loan-quantity").value);
    const book = state.books.find((b) => b.id === bookId);
    const reader = state.readers.find((r) => r.id === userId);
    const total = book && Number.isFinite(qty) && qty > 0 ? book.price * qty : 0;

    let text = "Total a descontar: <strong>" + formatMoney(total) + "</strong>";
    if (reader) text += " · saldo de " + escapeHtml(reader.name) + ": " + formatMoney(reader.money);

    document.getElementById("loan-summary").innerHTML = text;
    document.getElementById("loan-quantity-hint").textContent = book
        ? "Disponibles: " + book.stock
        : "";
}

export function openLoan(bookId) {
    fillLoanForm(bookId);
    openDialog("dialog-loan");
}

export function openBookForm(id) {
    const form = document.getElementById("book-form");
    clearErrors(form);

    document.getElementById("book-author").innerHTML =
        '<option value="">Selecciona un autor</option>' +
        state.authors
            .map((a) => {
                return '<option value="' + a.id + '">' + escapeHtml(a.name) + "</option>";
            }).join("");

    document.getElementById("book-categories").innerHTML = state.categories
        .map((c) => {
            return (
                '<label for="book-cat-' +
                c.id +
                '"><input type="checkbox" id="book-cat-' +
                c.id +
                '" name="categories" value="' +
                c.id +
                '" />' +
                escapeHtml(c.name) +
                "</label>"
            );
        }).join("");

    const editing = id ? state.books.find((b) => b.id === id) : null;

    document.getElementById("book-dialog-title").textContent = editing ? "Editar libro" : "Nuevo libro";
    document.getElementById("book-submit").textContent = editing ? "Guardar cambios" : "Añadir libro";
    document.getElementById("book-id").value = editing ? String(editing.id) : "";
    document.getElementById("book-title-input").value = editing ? editing.title : "";
    document.getElementById("book-author").value = editing
        ? String(editing.authorId)
        : state.authors[0]
        ? String(state.authors[0].id)
        : "";
    document.getElementById("book-price").value = editing ? String(editing.price) : "";
    document.getElementById("book-stock").value = editing ? String(editing.stock) : "1";

    if(editing) {
        editing.categoryIds.forEach((cid) => {
            const cb = document.getElementById("book-cat-" + cid);
            if(cb) cb.checked = true;
        });
    }

    openDialog("dialog-book");
}

export function openAuthorForm(id) {
    const form = document.getElementById("author-form");
    clearErrors(form);

    const editing = id ? state.authors.find((a) => a.id === id) : null;

    document.getElementById("author-dialog-title").textContent = editing ? "Editar autor" : "Nuevo autor";
    document.getElementById("author-submit").textContent = editing ? "Guardar" : "Añadir autor";
    document.getElementById("author-id").value = editing ? String(editing.id) : "";
    document.getElementById("author-name").value = editing ? editing.name : "";
    document.getElementById("author-year").value = editing ? String(editing.birthYear) : "";

    openDialog("dialog-author");
}

export function openReaderForm(id) {
    const form = document.getElementById("reader-form");
    clearErrors(form);

    const editing = id ? state.readers.find((r) => r.id === id) : null;

    document.getElementById("reader-dialog-title").textContent = editing ? "Editar lector" : "Nuevo lector";
    document.getElementById("reader-submit").textContent = editing ? "Guardar" : "Añadir lector";
    document.getElementById("reader-id").value = editing ? String(editing.id) : "";
    document.getElementById("reader-name").value = editing ? editing.name : "";
    document.getElementById("reader-money").value = editing ? String(editing.money) : "100";

    openDialog("dialog-reader");
}

export function openReturn(loanId) {
    const loan = state.loans.find((l) => l.id === loanId);
    if(!loan) return;

    const book = state.books.find((b) => b.id === loan.bookId);
    const reader = state.readers.find((r) => r.id === loan.userId);
    const refund = book ? book.price * loan.quantity : 0;

    setPendingReturnId(loanId);

    document.getElementById("return-desc").textContent =
        book && reader
            ? "Se repondrá " +
                (loan.quantity === 1 ? "1 ejemplar" : loan.quantity + " ejemplares") +
                " de " +
                book.title +
                " y se reembolsarán " +
                formatMoney(refund) +
                " a " +
                reader.name +
                "."
            : "Confirma la devolución.";

    openDialog("dialog-return");
}

export function openDelete(kind, id, label) {
    setPendingDelete({ kind, id, label });

    document.getElementById("delete-title").textContent = "Eliminar " + label;

    let warning = "Los libros conservarán el resto de sus categorías.";
    if(kind === "author") warning = "También se eliminarán sus libros y los préstamos asociados.";
    if(kind === "book") warning = "También se eliminarán los préstamos de este título.";
    if(kind === "reader") warning = "También se eliminarán los préstamos de este lector.";
    if(kind === "loan") warning = "Solo se pueden borrar préstamos ya devueltos.";

    document.getElementById("delete-desc").textContent = warning;
    openDialog("dialog-delete");
}