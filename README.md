# HTML Scientific Calculator

A polished, single-page HTML calculator built with Tailwind CSS and vanilla JavaScript. It supports both basic arithmetic and advanced scientific functions in a clean, responsive dark-themed interface.

## Description

This project is a self-contained `index.html` file — no build step, no dependencies beyond the Tailwind CSS CDN. Just open it in any modern browser and start calculating. The calculator features a two-section layout: a scientific functions grid (trigonometry, logarithms, powers, factorials, constants) and a basic operations grid (digits, arithmetic operators, equals, clear, and delete).

A top nav bar switches between two views: the **Calculator** and a **Todo List**. The todo list is backed by `server.py`, a stdlib-only Python server that serves the page and exposes a small REST API, persisting todos to `data/todos.json`.

## Features

### Basic Arithmetic
- **Addition** (+), **Subtraction** (−), **Multiplication** (×), **Division** (÷)
- **Division by zero** displays an error message
- **Decimal point** support
- **Clear** (AC) resets everything
- **Delete / Backspace** removes the last digit
- **Equals** (=) evaluates the expression

### Scientific Functions
- **Trigonometric**: sin, cos, tan — with a **DEG/RAD toggle** button
- **Logarithms**: log (base 10), ln (natural log)
- **Square root** (√)
- **Power**: x^y and x²
- **Factorial** (n!)
- **Constants**: π (pi), e
- **Percentage** (%)
- **Plus/minus toggle** (±)

### Todo List
- **Nav bar** to switch between the Calculator and Todo List views
- **Add todos** with an input field and Add button (or press `Enter`)
- **Toggle completion** with a checkbox — completed todos get a strikethrough
- **Delete todos** with a per-row Delete button
- **Empty state** message when there are no todos
- **Persisted** server-side to `data/todos.json` via a REST API

### Design & UX
- **Tailwind CSS** via CDN — no install required
- **Dark theme** with a modern, clean look and rounded buttons
- **Display area** showing the current input and the pending expression
- **Scientific functions** in a separate grid from basic operations
- **Responsive layout** — works on mobile and desktop
- **Color-coded buttons**: numbers (slate), operators (indigo), scientific (teal), equals (emerald), clear (rose), delete (amber)
- **Keyboard support**: number keys, `+` `-` `*` `/` operators, `Enter` or `=` (equals), `Escape` (clear), `Backspace` (delete), `.` (decimal), `%` (percent)

## How to Run

The calculator works standalone — just open `index.html` in any modern browser. The todo list needs the server, since it persists data to disk.

```bash
git clone <repo-url>
cd skep-testing
python3 server.py          # then open http://localhost:8000
```

`server.py` uses only the Python standard library (no `pip install` needed) and creates the `data/` directory on startup if it does not exist.

### Todo API

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET` | `/api/todos` | — | List all todos |
| `POST` | `/api/todos` | `{"text": "..."}` | Create a todo |
| `PUT` | `/api/todos/<id>` | `{"text": "...", "completed": true}` | Update a todo |
| `DELETE` | `/api/todos/<id>` | — | Delete a todo |

## Tech Stack

- **HTML** — single-file app structure
- **Tailwind CSS** — styling via CDN (`https://cdn.tailwindcss.com`)
- **Vanilla JavaScript** — all calculator logic inline in `index.html`

## Project Structure

```text
.
├── README.md      # Project documentation (this file)
├── check.py       # Verification script (python3 check.py)
├── index.html     # Calculator + todo list UI
├── server.py      # Static file server + todo REST API (stdlib only)
└── data/          # Todo storage (git-ignored, created on startup)
    └── todos.json
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9` | Enter digits |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Escape` | Clear (AC) |
| `Backspace` | Delete last character |
| `%` | Percentage |

## License

This repository is a demo project. See any `LICENSE` file if present for licensing details.

## Author

**Anmol Noor** — Software Engineer

- 🌐 Portfolio: [anmolnoor.com](https://anmolnoor.com)
- 🐙 GitHub: [@Anmolnoor](https://github.com/Anmolnoor)
- 💼 LinkedIn: [anmol-noor](https://www.linkedin.com/in/anmol-noor/)
- 🐦 X: [@noor_anmol](https://twitter.com/noor_anmol)
- 📧 Email: anmolnoor59@gmail.com
- 📅 Cal.com: [cal.com/anmolnoor](https://cal.com/anmolnoor)
- 📍 Vancouver, BC, Canada

## Built With

This calculator was built using [Skep](https://github.com/Anmolnoor/skep) — an agent supervisor that dispatches sandboxed coding workers with policy gates and approval workflows. The worker was powered by the glm-5.2 model via Ollama Cloud.

**Tech Stack:**
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- [Skep](https://github.com/Anmolnoor/skep) — agent supervisor & worker dispatch
- [Ollama](https://ollama.com) — LLM inference (glm-5.2:cloud)

---

Maintained with Skep.
