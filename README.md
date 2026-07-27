# HTML Scientific Calculator

A polished, single-page HTML calculator built with Tailwind CSS and vanilla JavaScript. It supports both basic arithmetic and advanced scientific functions in a clean, responsive dark-themed interface.

## Description

This project is a self-contained `index.html` file — no build step, no dependencies beyond the Tailwind CSS CDN. Just open it in any modern browser and start calculating. The calculator features a two-section layout: a scientific functions grid (trigonometry, logarithms, powers, factorials, constants) and a basic operations grid (digits, arithmetic operators, equals, clear, and delete).

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

### Design & UX
- **Tailwind CSS** via CDN — no install required
- **Dark theme** with a modern, clean look and rounded buttons
- **Display area** showing the current input and the pending expression
- **Scientific functions** in a separate grid from basic operations
- **Responsive layout** — works on mobile and desktop
- **Color-coded buttons**: numbers (slate), operators (indigo), scientific (teal), equals (emerald), clear (rose), delete (amber)
- **Keyboard support**: number keys, `+` `-` `*` `/` operators, `Enter` or `=` (equals), `Escape` (clear), `Backspace` (delete), `.` (decimal), `%` (percent)

## How to Run

1. Download or clone the repository.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

That's it — no server, no build step, no dependencies to install.

```bash
git clone <repo-url>
cd skep-testing
# Then open index.html in your browser
```

## Tech Stack

- **HTML** — single-file app structure
- **Tailwind CSS** — styling via CDN (`https://cdn.tailwindcss.com`)
- **Vanilla JavaScript** — all calculator logic inline in `index.html`

## Project Structure

```text
.
├── README.md      # Project documentation (this file)
└── index.html     # Complete calculator app (self-contained)
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

---

Maintained with Skep.
