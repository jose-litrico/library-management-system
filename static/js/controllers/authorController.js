import { clearErrors, showError, closeDialogs } from "../ui/dialogs.js";
import { validateAuthor } from "../validators/validators.js";
import { authorsApi } from "../api/api.js";
import { toast } from "../utils/utils.js";
import { reloadData } from "./dataController.js";

export async function submit(form) {
    clearErrors(form);

    const name = document.getElementById("author-name").value.trim();
    const birthYear = Number(document.getElementById("author-year").value);

    const errors = validateAuthor({ name, birthYear });
    if(errors) {
        if(errors.name) showError("author-name-error", errors.name);
        if(errors.birthYear) showError("author-year-error", errors.birthYear);
        
        return;
    }

    const payload = {
        name,
        birth_year: birthYear,
    };

    const id = document.getElementById("author-id").value;

    try {
        if(id) {
            await authorsApi.update(Number(id), payload);
            toast("Autor actualizado");
        }else {
            await authorsApi.create(payload);
            toast("Autor añadido");
        }
        
        closeDialogs();
        await reloadData();
    } catch (err) {
        toast("No se pudo guardar el autor");
    }
}