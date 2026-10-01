import { clearErrors, showError, closeDialogs } from "../ui/dialogs.js";
import { validateReader } from "../validators/validators.js";
import { usersApi } from "../api/api.js";
import { toast } from "../utils/utils.js";
import { reloadData } from "./dataController.js";

export async function submit(form) {
    clearErrors(form);

    const name = document.getElementById("reader-name").value.trim();
    const money = Number(document.getElementById("reader-money").value);

    const errors = validateReader({ name, money });
    if(errors) {
        if(errors.name) showError("reader-name-error", errors.name);
        if(errors.money) showError("reader-money-error", errors.money);
        
        return;
    }

    const payload = { name, money };
    const id = document.getElementById("reader-id").value;

    try {
        if(id) {
            await usersApi.update(Number(id), payload);
            toast("Lector actualizado");
        }else {
            await usersApi.create(payload);
            toast("Lector añadido");
        }
        
        closeDialogs();
        await reloadData();
    } catch (err) {
        toast("No se pudo guardar el lector");
    }
}