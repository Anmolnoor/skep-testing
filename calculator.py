"""A simple calculator module supporting basic arithmetic operations."""


class Calculator:
    """A calculator that performs basic arithmetic operations."""

    def add(self, a: float, b: float) -> float:
        """Return the sum of a and b."""
        return a + b

    def subtract(self, a: float, b: float) -> float:
        """Return the difference of a and b."""
        return a - b

    def multiply(self, a: float, b: float) -> float:
        """Return the product of a and b."""
        return a * b

    def divide(self, a: float, b: float) -> float:
        """Return the quotient of a divided by b.

        Raises:
            ZeroDivisionError: If b is zero.
        """
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b


# CLI entry point
if __name__ == "__main__":
    import sys

    if len(sys.argv) != 4:
        print("Usage: python calculator.py <num1> <operator> <num2>")
        print("Operators: +, -, *, /")
        sys.exit(1)

    calc = Calculator()
    x = float(sys.argv[1])
    op = sys.argv[2]
    y = float(sys.argv[3])

    operations = {
        "+": calc.add,
        "-": calc.subtract,
        "*": calc.multiply,
        "/": calc.divide,
    }

    if op not in operations:
        print(f"Unknown operator: {op}. Use one of +, -, *, /")
        sys.exit(1)

    result = operations[op](x, y)
    print(f"{x} {op} {y} = {result}")