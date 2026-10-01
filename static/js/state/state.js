import { SEED } from "../constants/constants.js";
import { clone } from "../utils/utils.js";

export let state = {
    authors: [],
    categories: [],
    books: [],
    readers: [],
    loans: [],
};

export let filters = {
    query: "",
    categoryId: "all",
    availability: "all",
};

export let pendingReturnId = null;
export let pendingDelete = null;
export let lastFocus = null;

export function setState(newState) {
    state = newState;
}

export function setFilters(newFilters) {
    filters = { ...filters, ...newFilters };
}

export function resetFilters() {
    filters = {
        query: "",
        categoryId: "all",
        availability: "all",
    };
}

export function setPendingReturnId(id) {
    pendingReturnId = id;
}

export function setPendingDelete(data) {
    pendingDelete = data;
}

export function setLastFocus(element) {
    lastFocus = element;
}

export function getSeedState() {
    return clone(SEED);
}