import { STORAGE_KEY } from "../constants/constants.js";

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
    } catch (_) {}

    return null;
}

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
}

export function roundMoney(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n) {
    return "$" + roundMoney(n).toFixed(2);
}

export function formatDate(iso) {
    try {
        return new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(iso));
    } catch (_) {
        return iso.slice(0, 10);
    }
}

export function hashString(value) {
    let hash = 0;
    for(let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }

    return Math.abs(hash);
}

export function toast(message) {
    const region = document.getElementById("toast-region");
    const el = document.createElement("div");

    el.className = "toast";
    el.textContent = message;
    region.appendChild(el);

    setTimeout(function () {
        el.remove();
    }, 2800);
}

export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}