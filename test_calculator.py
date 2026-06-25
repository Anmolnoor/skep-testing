"""Tests for the Calculator class in calculator.py."""

import pytest
from calculator import Calculator


@pytest.fixture
def calc():
    return Calculator()


class TestAdd:
    def test_add_positive(self, calc):
        assert calc.add(2, 3) == 5

    def test_add_negative(self, calc):
        assert calc.add(-2, -3) == -5

    def test_add_mixed(self, calc):
        assert calc.add(-2, 3) == 1

    def test_add_floats(self, calc):
        assert calc.add(1.5, 2.5) == 4.0

    def test_add_zero(self, calc):
        assert calc.add(0, 5) == 5


class TestSubtract:
    def test_subtract_positive(self, calc):
        assert calc.subtract(5, 3) == 2

    def test_subtract_negative(self, calc):
        assert calc.subtract(-5, -3) == -2

    def test_subtract_equal(self, calc):
        assert calc.subtract(5, 5) == 0


class TestMultiply:
    def test_multiply_positive(self, calc):
        assert calc.multiply(3, 4) == 12

    def test_multiply_zero(self, calc):
        assert calc.multiply(5, 0) == 0

    def test_multiply_negative(self, calc):
        assert calc.multiply(-3, 4) == -12


class TestDivide:
    def test_divide_positive(self, calc):
        assert calc.divide(10, 2) == 5

    def test_divide_float(self, calc):
        assert calc.divide(7, 2) == 3.5

    def test_divide_by_zero(self, calc):
        with pytest.raises(ZeroDivisionError, match="Cannot divide by zero"):
            calc.divide(5, 0)

    def test_divide_negative(self, calc):
        assert calc.divide(-10, 2) == -5