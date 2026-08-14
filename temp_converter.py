"""A tiny temperature conversion utility."""


def celsius_to_fahrenheit(celsius):
    """Convert a temperature from Celsius to Fahrenheit."""
    return celsius * 9 / 5 + 32


def fahrenheit_to_celsius(fahrenheit):
    """Convert a temperature from Fahrenheit to Celsius."""
    return (fahrenheit - 32) * 5 / 9


if __name__ == "__main__":
    print(f"0C is {celsius_to_fahrenheit(0)}F")
    print(f"212F is {fahrenheit_to_celsius(212)}C")
