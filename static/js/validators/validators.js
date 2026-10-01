export function validateBook({ title, authorId, categoryIds, price, stock }) {
    const errors = {};

    if(!title || !title.trim()) errors.title = "El título es obligatorio.";
    else if (title.length > 50) errors.title = "Máximo 50 caracteres.";

    if(!authorId) errors.author = "Elige un autor.";

    if(!categoryIds || !categoryIds.length) errors.categories = "Elige al menos una categoría.";
    

    if(!Number.isFinite(price) || price < 0.01) errors.price = "El precio debe ser mayor que 0.";
    

    if(!Number.isInteger(stock) || stock < 0) errors.stock = "El stock no puede ser negativo.";
    
    return Object.keys(errors).length ? errors : null;
}

export function validateAuthor({ name, birthYear }) {
    const errors = {};

    if(!name || !name.trim()) errors.name = "El nombre es obligatorio.";
    
    if(!Number.isInteger(birthYear) || birthYear < 1000 || birthYear > 2026) errors.birthYear = "Indica un año de nacimiento válido.";

    return Object.keys(errors).length ? errors : null;
}

export function validateReader({ name, money }) {
    const errors = {};

    if(!name || !name.trim()) errors.name = "El nombre es obligatorio.";

    if(!Number.isFinite(money) || money < 0) errors.money = "El saldo no puede ser negativo.";
    else if (money > 9999.99) errors.money = "El saldo máximo es 9999.99.";
    
    return Object.keys(errors).length ? errors : null;
}

export function validateLoan({ userId, bookId, quantity }) {
    const errors = {};

    if (!userId) errors.user = "Selecciona un lector.";

    if (!bookId) errors.book = "Selecciona un libro.";

    if (!Number.isFinite(quantity) || quantity <= 0) errors.quantity = "La cantidad debe ser mayor que 0.";

    return Object.keys(errors).length ? errors : null;
}