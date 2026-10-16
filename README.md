# Temp Converter

A tiny Python utility for converting temperatures between Celsius and Fahrenheit.

## Usage

```python
from temp_converter import celsius_to_fahrenheit, fahrenheit_to_celsius

celsius_to_fahrenheit(0)    # 32.0
fahrenheit_to_celsius(212)  # 100.0
```

## Calculadora de costos de impresión 3D

`print_cost_calculator.py` calcula cuánto cuesta producir una pieza impresa
en 3D y a qué precio venderla, desglosando material, uso de máquina, mano de
obra, impresiones fallidas, margen e impuesto.

Desde Python:

```python
from print_cost_calculator import PrintJob, calculate_cost

job = PrintJob(material="PETG", weight_grams=80, print_hours=6, margin_percent=40)
quote = calculate_cost(job)
quote.production_cost   # costo de producir la pieza
quote.price_before_tax  # precio de venta sugerido
```

Desde la línea de comandos:

```bash
python print_cost_calculator.py --material PETG --peso 80 --horas 6 --margen 40 --iva 21
python print_cost_calculator.py --volumen 25 --horas 4 --cantidad 10   # volumen en cm³
python print_cost_calculator.py --help                                  # todas las opciones
```

Materiales incluidos: PLA, PETG, ABS, TPU, NYLON y RESINA, con precios
orientativos por kilo que se pueden sobrescribir con `--precio-kg` o pasando
un `Material` propio.

## Running the tests

```bash
pip install -r requirements.txt
pytest
```
