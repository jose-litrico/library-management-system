# Ateneo — Sala de préstamo

Aplicación web full-stack para gestionar el catálogo de una biblioteca de sala: libros, autores, categorías, lectores y préstamos.

El backend expone una API REST con Django y Django REST Framework. El frontend es una interfaz en JavaScript modular que consume esa API, con las mismas reglas de negocio (stock, saldo y préstamos activos).

---

## Características

- Catálogo de libros con autor, categorías, precio y stock
- Gestión de autores y lectores (saldo)
- Préstamos y devoluciones
  - Sin stock no hay préstamo
  - Se descuenta el saldo del lector al prestar y se reembolsa al devolver
  - Un lector no puede tener dos préstamos activos del mismo libro
- Panel de administración Django (`/admin/`)
- Frontend modular (API, state, UI, controllers, events)
- Comando para cargar datos de muestra (`seed_library`)

---

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Python, Django 6, Django REST Framework |
| Base de datos | SQLite (desarrollo) |
| Frontend | HTML, CSS, JavaScript (ES modules) |
| Config | `python-dotenv` / variables de entorno |

---

## Requisitos

- Python 3.12 o superior (recomendado)
- `pip`
- Git (opcional, si clonas el repositorio)

---

## Instalación

### 1. Clonar o abrir el proyecto

```bash
cd ruta/a/tu/proyecto