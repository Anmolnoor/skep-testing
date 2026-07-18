# Python Calculator

A simple, self-contained Python calculator project demonstrating clean module design, a command-line interface (CLI), and a pytest test suite. The repository also includes a small "Hello, world!" script and an `index.html` landing page.

## Description

This project provides a `Calculator` class that supports the four basic arithmetic operations — addition, subtraction, multiplication, and division — with input validation and meaningful errors (e.g. division by zero). The calculator can be used either as an importable Python module or directly from the command line via `calculator.py`.

The repository is used as an end-to-end test fixture for the Skep supervisor tool, but it is also a clean, runnable example of a minimal Python CLI project with tests.

## Features

- **Basic arithmetic**: add, subtract, multiply, and divide.
- **Type-friendly**: accepts `float` operands and returns `float` results.
- **Safe division**: raises a clear `ZeroDivisionError` when dividing by zero.
- **Command-line interface**: run calculations directly from the terminal, e.g. `python calculator.py 5 + 3`.
- **Importable module**: use the `Calculator` class in other Python code.
- **Pytest test suite**: covers positive, negative, mixed-sign, float, and zero cases for each operation.
- **Hello script**: a minimal `hello.py` that prints a greeting.
- **Landing page**: an `index.html` file for simple browser-based presentation.

## Tech Stack

- **Language**: Python 3
- **Testing**: pytest
- **CLI**: Python standard library (`sys`, `argparse`-style manual parsing)
- **No external dependencies required** for the calculator itself (pytest only needed to run the test suite).

## Setup / Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd skep-testing
   ```

2. (Optional) Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install test dependencies:

   ```bash
   pip install pytest
   ```

   > Note: the calculator itself has no third-party dependencies. If a `requirements.txt` is present, run `pip install -r requirements.txt` instead.

## Usage

### Calculator CLI

Run the calculator from the command line with two operands and one operator:

```bash
python calculator.py <num1> <operator> <num2>
```

Supported operators: `+`, `-`, `*`, `/`

Examples:

```bash
python calculator.py 5 + 3
# 5.0 + 3.0 = 8.0

python calculator.py 10 / 4
# 10.0 / 4.0 = 2.5

python calculator.py 7 - 2
# 7.0 - 2.0 = 5.0

python calculator.py 6 * 4
# 6.0 * 4.0 = 24.0
```

If the wrong number of arguments is supplied, usage instructions are printed:

```bash
python calculator.py
# Usage: python calculator.py <num1> <operator> <num2>
# Operators: +, -, *, /
```

### Using the Calculator class in Python

```python
from calculator import Calculator

calc = Calculator()
print(calc.add(2, 3))        # 5
print(calc.subtract(5, 3))  # 2
print(calc.multiply(3, 4))  # 12
print(calc.divide(7, 2))     # 3.5
```

Division by zero raises a `ZeroDivisionError`:

```python
calc.divide(5, 0)
# ZeroDivisionError: Cannot divide by zero
```

### Hello script

```bash
python hello.py
# Hello, world!
```

## Project Structure

```text
.
├── README.md            # Project documentation (this file)
├── calculator.py        # Calculator class and CLI entry point
├── hello.py             # Simple "Hello, world!" script
├── index.html           # Static landing page
└── test_calculator.py  # Pytest test suite for the Calculator class
```

### Key files

- **`calculator.py`** — Defines the `Calculator` class with `add`, `subtract`, `multiply`, and `divide` methods. When executed as a script, it parses `sys.argv` to perform a single calculation and prints the result.
- **`hello.py`** — A one-line script that prints `Hello, world!`.
- **`test_calculator.py`** — A pytest test suite organized into `TestAdd`, `TestSubtract`, `TestMultiply`, and `TestDivide` classes, using a `calc` fixture.
- **`index.html`** — A static HTML page for browser-based presentation.

## Testing

The project uses [pytest](https://docs.pytest.org/) for testing.

Run the full test suite:

```bash
pytest test_calculator.py
```

Run with verbose output:

```bash
pytest test_calculator.py -v
```

### Test coverage

The suite covers the following cases:

- **Addition**: positive, negative, mixed-sign, float, and zero operands.
- **Subtraction**: positive, negative, and equal operands.
- **Multiplication**: positive, zero, and negative operands.
- **Division**: positive, float, negative, and division-by-zero (expects `ZeroDivisionError`).

## License

This repository is primarily a test fixture and demo project. See any `LICENSE` file if present for licensing details.

---

Maintained with Skep.

## HTML Version

The calculator is also available as a web page — open `index.html` in a browser. Features include:
- Standard calculator with memory functions
- Unit conversions
- Number base conversion
- Currency converter
- Date/time calculator
- Light/dark theme toggle
