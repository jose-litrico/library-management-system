import { clearErrors, showError, closeDialogs } from "../ui/dialogs.js";
import { validateBook } from "../validators/validators.js";
import { booksApi } from "../api/api.js";
import { toast } from "../utils/utils.js";
import { reloadData } from "./dataController.js";

export async function submit(form) {
    clearErrors(form);

    const title = document.getElementById("book-title-input").value.trim();
    const authorId = Number(document.getElementById("book-author").value);
    const price = Number(document.getElementById("book-price").value);
    const stock = Number(document.getElementById("book-stock").value);
    const categoryIds = Array.from(
        document.querySelectorAll('#book-categories input[type="checkbox"]:checked')
    ).map((cb) => Number(cb.value));

    const errors = validateBook({ title, authorId, categoryIds, price, stock });
    if(errors) {
        if(errors.title) showError("book-title-error", errors.title);
        if(errors.author) showError("book-author-error", errors.author);
        if(errors.categories) showError("book-categories-error", errors.categories);
        if(errors.price) showError("book-price-error", errors.price);
        if(errors.stock) showError("book-stock-error", errors.stock);
        
        return;
    }

    const payload = {
        title,
        author: authorId,
        categories: categoryIds,
        price,
        stock,
    };

    const id = document.getElementById("book-id").value;

    try {
        if(id) {
            await booksApi.update(Number(id), payload);
            toast("Libro actualizado");
        }else {
            await booksApi.create(payload);
            toast("Libro añadido al catálogo");
        }
        closeDialogs();
        await reloadData();
    } catch (err) {
        toast("No se pudo guardar el libro");
    }
}