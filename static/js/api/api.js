const BASE_URL = "/api";

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
            ...options.headers,
        },
        ...options,
    };

    if(config.body && typeof config.body === "object") {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")) {
        data = await response.json();
    }

    if(!response.ok) {
        const error = new Error("API Error");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const authorsApi = {
    list() {
        return request("/authors/");
    },

    get(id) {
        return request(`/authors/${id}/`);
    },

    create(payload) {
        return request("/authors/", {
            method: "POST",
            body: payload,
        });
    },

    update(id, payload) {
        return request(`/authors/${id}/`, {
            method: "PUT",
            body: payload,
        });
    },

    delete(id) {
        return request(`/authors/${id}/`, {
            method: "DELETE",
        });
    },
};

export const categoriesApi = {
    list() {
        return request("/categories/");
    },

    get(id) {
        return request(`/categories/${id}/`);
    },

    create(payload) {
        return request("/categories/", {
            method: "POST",
            body: payload,
        });
    },

    update(id, payload) {
        return request(`/categories/${id}/`, {
            method: "PUT",
            body: payload,
        });
    },

    delete(id) {
        return request(`/categories/${id}/`, {
            method: "DELETE",
        });
    },
};

export const booksApi = {
    list() {
        return request("/books/");
    },

    get(id) {
        return request(`/books/${id}/`);
    },

    create(payload) {
        return request("/books/", {
            method: "POST",
            body: payload,
        });
    },

    update(id, payload) {
        return request(`/books/${id}/`, {
            method: "PUT",
            body: payload,
        });
    },

    delete(id) {
        return request(`/books/${id}/`, {
            method: "DELETE",
        });
    },
};

export const usersApi = {
    list() {
        return request("/users/");
    },

    get(id) {
        return request(`/users/${id}/`);
    },

    create(payload) {
        return request("/users/", {
            method: "POST",
            body: payload,
        });
    },

    update(id, payload) {
        return request(`/users/${id}/`, {
            method: "PUT",
            body: payload,
        });
    },

    delete(id) {
        return request(`/users/${id}/`, {
            method: "DELETE",
        });
    },
};

export const loansApi = {
    list() {
        return request("/loans/");
    },

    get(id) {
        return request(`/loans/${id}/`);
    },

    create({ userId, bookId, quantity }) {
        return request("/loans/", {
            method: "POST",
            body: {
            user: userId,
            book: bookId,
            quantity,
            },
        });
    },

    return(id) {
        return request(`/loans/${id}/return/`, {
            method: "POST",
        });
    },

    delete(id) {
        return request(`/loans/${id}/`, {
            method: "DELETE",
        });
    },
};

export const api = {
    authors: authorsApi,
    categories: categoriesApi,
    books: booksApi,
    users: usersApi,
    loans: loansApi,
};

export default api;