# Ateneo — Lending Room

Full-stack web application to manage a room library catalog: books, authors, categories, readers, and loans.

The backend exposes a REST API built with Django and Django REST Framework. The frontend is a modular JavaScript interface that consumes the API while enforcing the same business logic (stock, balance, and active loans).

---

## Features

- Book catalog with author, categories, price, and stock
- Author and reader management (reader balance)
- Loans and returns
- No lending allowed if out of stock
- Reader balance is deducted upon borrowing and refunded upon returning
- A reader cannot have two active loans for the same book
- Django administration panel (`/admin/`)
- Modular frontend (API, state, UI, controllers, events)
- Command to seed sample data (`seed_library`)

---

## Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Backend        | Python, Django 6, Django REST Framework |
| Database       | SQLite (development)                    |
| Frontend       | HTML, CSS, JavaScript (ES modules)      |
| Config         | `python-dotenv` / environment variables |

---

## Requirements

- Python 3.12 or higher
- `pip`
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/jose_litrico/library-management-system.git
cd library-management-system