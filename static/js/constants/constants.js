export const STORAGE_KEY = "ateneo-library-html";

export const PALETTES = [
    { bg: "#2a221b", fg: "#efe4d2", rule: "#8c7358" },
    { bg: "#1c2420", fg: "#dce6df", rule: "#6d8578" },
    { bg: "#261c1c", fg: "#eddcd8", rule: "#8a625c" },
    { bg: "#1c1f26", fg: "#dde2ec", rule: "#6a7388" },
    { bg: "#241f16", fg: "#ebe3cc", rule: "#7d7352" },
    { bg: "#1a1a1a", fg: "#e8e2d8", rule: "#8a8a84" },
];

export const SEED = {
    authors: [
        { id: 1, name: "Gabriel García Márquez", birthYear: 1927 },
        { id: 2, name: "Jorge Luis Borges", birthYear: 1899 },
        { id: 3, name: "Clarice Lispector", birthYear: 1920 },
        { id: 4, name: "Julio Cortázar", birthYear: 1914 },
        { id: 5, name: "Isabel Allende", birthYear: 1942 },
        { id: 6, name: "Roberto Bolaño", birthYear: 1953 },
        { id: 7, name: "Elena Poniatowska", birthYear: 1932 },
        { id: 8, name: "Mario Vargas Llosa", birthYear: 1936 },
    ],
    
    categories: [
        { id: 1, name: "Realismo mágico" },
        { id: 2, name: "Cuento" },
        { id: 3, name: "Novela" },
        { id: 4, name: "Crónica" },
        { id: 5, name: "Ensayo" },
    ],

    books: [
        { id: 1, title: "Cien años de soledad", price: 25.5, stock: 5, authorId: 1, categoryIds: [1, 3], createdAt: "2026-01-12T10:00:00.000Z" },
        { id: 2, title: "Ficciones", price: 18.0, stock: 4, authorId: 2, categoryIds: [2, 5], createdAt: "2026-01-18T10:00:00.000Z" },
        { id: 3, title: "La hora de la estrella", price: 14.75, stock: 3, authorId: 3, categoryIds: [3], createdAt: "2026-02-02T10:00:00.000Z" },
        { id: 4, title: "Rayuela", price: 22.0, stock: 2, authorId: 4, categoryIds: [3], createdAt: "2026-02-14T10:00:00.000Z" },
        { id: 5, title: "La casa de los espíritus", price: 19.9, stock: 6, authorId: 5, categoryIds: [1, 3], createdAt: "2026-03-01T10:00:00.000Z" },
        { id: 6, title: "Los detectives salvajes", price: 27.0, stock: 1, authorId: 6, categoryIds: [3], createdAt: "2026-03-20T10:00:00.000Z" },
        { id: 7, title: "La noche de Tlatelolco", price: 16.5, stock: 4, authorId: 7, categoryIds: [4], createdAt: "2026-04-04T10:00:00.000Z" },
        { id: 8, title: "La ciudad y los perros", price: 21.0, stock: 0, authorId: 8, categoryIds: [3], createdAt: "2026-04-22T10:00:00.000Z" },
        { id: 9, title: "El amor en los tiempos del cólera", price: 23.4, stock: 3, authorId: 1, categoryIds: [1, 3], createdAt: "2026-05-08T10:00:00.000Z" },
        { id: 10, title: "El Aleph", price: 17.25, stock: 5, authorId: 2, categoryIds: [2], createdAt: "2026-05-19T10:00:00.000Z" },
    ],

    readers: [
        { id: 1, name: "José Luis", money: 100.0 },
        { id: 2, name: "Juan Marco", money: 200.0 },
        { id: 3, name: "Ana María Ríos", money: 150.0 },
        { id: 4, name: "Lucía Herrera", money: 80.0 },
    ],

    loans: [
        { id: 1, userId: 3, bookId: 4, quantity: 1, status: "active", createdAt: "2026-09-10T15:20:00.000Z" },
        { id: 2, userId: 2, bookId: 2, quantity: 1, status: "returned", createdAt: "2026-08-22T11:00:00.000Z" },
    ],

    nextIds: { author: 9, category: 6, book: 11, reader: 5, loan: 3 },
};