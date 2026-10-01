import { initEvents } from "./events/events.js";
import { reloadData } from "./controllers/dataController.js";
import { toast } from "./utils/utils.js";

async function main() {
    try {
        await reloadData();
    } catch(err) {
        console.error(err);
        toast("No se pudo cargar el catálogo");
    }

    initEvents();
}

main();