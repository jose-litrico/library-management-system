import {
    openLoan,
    openBookForm,
    openAuthorForm,
    openReaderForm,
    openReturn,
    openDelete,
    closeDialogs,
    updateLoanSummary,
} from "../ui/dialogs.js";
import * as loanController from "../controllers/loanController.js";
import * as bookController from "../controllers/bookController.js";
import * as authorController from "../controllers/authorController.js";
import * as readerController from "../controllers/readerController.js";
import * as catalogController from "../controllers/catalogController.js";

function handleClick(e) {
    const closeBtn = e.target.closest("[data-close]");
    if(closeBtn) {
        closeDialogs();

        return;
    }

    if(e.target.classList.contains("dialog-backdrop")) {
        closeDialogs();

        return;
    }

    const actionEl = e.target.closest("[data-action]");

    if (!actionEl) {
        const catBtn = e.target.closest("[data-category]");
        if(catBtn) {
            catalogController.filterByCategory(catBtn.getAttribute("data-category"));
            
            return;
        }

        const avBtn = e.target.closest("[data-availability]");
        
        if(avBtn) catalogController.filterByAvailability(avBtn.getAttribute("data-availability"));
        
        return;
    }

    const action = actionEl.getAttribute("data-action");

    if(action === "open-loan") {
        const bookId = actionEl.getAttribute("data-book-id");
        openLoan(bookId ? Number(bookId) : undefined);
    }else if (action === "open-book") {
        openBookForm();
    }else if (action === "edit-book") {
        openBookForm(Number(actionEl.getAttribute("data-id")));
    }else if (action === "open-author") {
        openAuthorForm();
    }else if (action === "edit-author") {
        openAuthorForm(Number(actionEl.getAttribute("data-id")));
    }else if (action === "open-reader") {
        openReaderForm();
    }else if (action === "edit-reader") {
        openReaderForm(Number(actionEl.getAttribute("data-id")));
    }else if (action === "return") {
        openReturn(Number(actionEl.getAttribute("data-id")));
    }else if (action === "delete") {
        openDelete(
            actionEl.getAttribute("data-kind"),
            Number(actionEl.getAttribute("data-id")),
            actionEl.getAttribute("data-label") || "registro"
        );
    }
}

function initNavObserver() {
    const navLinks = document.querySelectorAll("[data-nav]");
    const sections = ["inicio", "catalogo", "autores", "lectores", "prestamos"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if(!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((en) => en.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if(visible && visible.target.id) {
                navLinks.forEach((link) => {
                    const on = link.getAttribute("data-nav") === visible.target.id;
                    
                    if(on) link.setAttribute("aria-current", "true");
                    else link.removeAttribute("aria-current");
                });
            }
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
}

export function initEvents() {
    document.addEventListener("click", handleClick);

    document.getElementById("catalog-search").addEventListener("input", (e) => {
        catalogController.search(e.target.value);
    });

    document.getElementById("loan-user").addEventListener("change", updateLoanSummary);
    document.getElementById("loan-book").addEventListener("change", updateLoanSummary);
    document.getElementById("loan-quantity").addEventListener("input", updateLoanSummary);

    document.getElementById("loan-form").addEventListener("submit", (e) => {
        e.preventDefault();
        loanController.submit(e.target);
    });

    document.getElementById("book-form").addEventListener("submit", (e) => {
        e.preventDefault();
        bookController.submit(e.target);
    });

    document.getElementById("author-form").addEventListener("submit", (e) => {
        e.preventDefault();
        authorController.submit(e.target);
    });

    document.getElementById("reader-form").addEventListener("submit", (e) => {
        e.preventDefault();
        readerController.submit(e.target);
    });

    document.getElementById("confirm-return").addEventListener("click", () => {
        loanController.confirmReturn();
    });

    document.getElementById("confirm-delete").addEventListener("click", () => {
        catalogController.confirmDelete();
    });

    document.getElementById("reset-catalog").addEventListener("click", () => {
        catalogController.resetCatalog();
    });

    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") closeDialogs();
    });

    initNavObserver();
}