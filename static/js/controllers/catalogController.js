import {
    pendingDelete,
    setPendingDelete,
    setState,
    setFilters,
    resetFilters,
    getSeedState,
} from "../state/state.js";
import { closeDialogs } from "../ui/dialogs.js";
import { renderAll, renderBooks, renderCategoryChips } from "../ui/render.js";
import {
    authorsApi,
    booksApi,
    usersApi,
    loansApi,
} from "../api/api.js";
import { toast } from "../utils/utils.js";
import { reloadData } from "./dataController.js";
import { filters } from "../state/state.js";

export function filterByCategory(value) {
    setFilters({
        categoryId: value === "all" ? "all" : Number(value),
    });
    renderCategoryChips();
    renderBooks();
}

export function filterByAvailability(value) {
    setFilters({ availability: value });
    document.querySelectorAll("[data-availability]").forEach((btn) => {
        const on = btn.getAttribute("data-availability") === filters.availability;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderBooks();
}

export function search(query) {
    setFilters({ query });
    renderBooks();
}

export async function confirmDelete() {
    if(!pendingDelete) return;

    const { kind, id } = pendingDelete;

    try {
        if(kind === "author") await authorsApi.delete(id);
        else if (kind === "book") await booksApi.delete(id);
        else if (kind === "reader") await usersApi.delete(id);
        else if (kind === "loan") await loansApi.delete(id);

        toast("Registro eliminado");
        setPendingDelete(null);
        closeDialogs();
        await reloadData();
    } catch (err) {
        const data = err.data || {};
        toast(data.error || data.detail || "No se pudo eliminar");
    }
}

export function resetCatalog() {
    setState(getSeedState());
    resetFilters();

    document.getElementById("catalog-search").value = "";
    document.querySelectorAll("[data-availability]").forEach((btn) => {
        const on = btn.getAttribute("data-availability") === "all";
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    toast("Catálogo restaurado (solo local)");
    renderAll();
}