from temp_converter import celsius_to_fahrenheit, fahrenheit_to_celsius


def test_celsius_to_fahrenheit_freezing():
    assert celsius_to_fahrenheit(0) == 32


def test_celsius_to_fahrenheit_boiling():
    assert celsius_to_fahrenheit(100) == 212


def test_fahrenheit_to_celsius_freezing():
    assert fahrenheit_to_celsius(32) == 0


def test_fahrenheit_to_celsius_boiling():
    assert fahrenheit_to_celsius(212) == 100
