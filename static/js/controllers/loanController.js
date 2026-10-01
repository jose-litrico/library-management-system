import {
    pendingReturnId,
    setPendingReturnId,
} from "../state/state.js";
import { clearErrors, showError, closeDialogs } from "../ui/dialogs.js";
import { validateLoan } from "../validators/validators.js";
import { loansApi } from "../api/api.js";
import { toast } from "../utils/utils.js";
import { reloadData } from "./dataController.js";

export async function submit(form) {
    clearErrors(form);

    const userId = Number(document.getElementById("loan-user").value);
    const bookId = Number(document.getElementById("loan-book").value);
    const quantity = Number(document.getElementById("loan-quantity").value);

    const errors = validateLoan({ userId, bookId, quantity });
    if(errors) {
        if(errors.user) showError("loan-user-error", errors.user);
        if(errors.book) showError("loan-book-error", errors.book);
        if(errors.quantity) showError("loan-quantity-error", errors.quantity);

        return;
    }

    try {
        await loansApi.create({ userId, bookId, quantity });
        toast("Préstamo registrado");
        closeDialogs();
        await reloadData();
    } catch (err) {
        const data = err.data || {};

        if(data.user) showError("loan-user-error", Array.isArray(data.user) ? data.user[0] : data.user);
        if(data.book) showError("loan-book-error", Array.isArray(data.book) ? data.book[0] : data.book);
        if(data.quantity) showError("loan-quantity-error", Array.isArray(data.quantity) ? data.quantity[0] : data.quantity);
        if(!data.user && !data.book && !data.quantity) {
            toast("No se pudo registrar el préstamo");
        }
    }
}

export async function confirmReturn() {
    if(pendingReturnId == null) return;

    try {
        await loansApi.return(pendingReturnId);

        toast("Préstamo devuelto");
        setPendingReturnId(null);
        closeDialogs();

        await reloadData();
    } catch (err) {
        const data = err.data || {};
        toast(data.status || data.loan || "No se pudo devolver");
    }
}