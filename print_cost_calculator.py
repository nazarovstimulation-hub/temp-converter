"""Calculadora de costos para una imprenta 3D.

Calcula cuánto cuesta producir una pieza impresa en 3D y a qué precio
conviene venderla, desglosando:

* material (filamento o resina) consumido,
* uso de máquina (electricidad + desgaste/amortización),
* mano de obra de preparación y postproceso,
* sobrecosto por impresiones fallidas,
* margen de ganancia,
* impuesto (IVA) opcional.

Uso como módulo::

    from print_cost_calculator import PrintJob, calculate_cost

    job = PrintJob(material="PLA", weight_grams=45, print_hours=3.5)
    quote = calculate_cost(job)
    print(quote.total_with_tax)

Uso desde la línea de comandos::

    python print_cost_calculator.py --material PETG --peso 80 --horas 6 --margen 40
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass, field


# --------------------------------------------------------------------------- #
# Materiales
# --------------------------------------------------------------------------- #

@dataclass(frozen=True)
class Material:
    """Un material de impresión con su precio y densidad.

    ``price_per_kg`` está en la moneda que use la imprenta (se trata como un
    número sin unidad). ``density`` está en g/cm³ y sirve para convertir el
    volumen que reporta el laminador a gramos.
    """

    name: str
    price_per_kg: float
    density: float  # g/cm³


# Precios orientativos por kilo y densidades típicas. Se pueden sobrescribir
# pasando un ``Material`` propio a ``PrintJob``.
MATERIALS: dict[str, Material] = {
    "PLA": Material("PLA", price_per_kg=20.0, density=1.24),
    "PETG": Material("PETG", price_per_kg=25.0, density=1.27),
    "ABS": Material("ABS", price_per_kg=22.0, density=1.04),
    "TPU": Material("TPU", price_per_kg=35.0, density=1.21),
    "NYLON": Material("NYLON", price_per_kg=45.0, density=1.14),
    "RESINA": Material("RESINA", price_per_kg=40.0, density=1.10),
}


def get_material(name: str) -> Material:
    """Busca un material por nombre (sin distinguir mayúsculas)."""
    key = name.strip().upper()
    try:
        return MATERIALS[key]
    except KeyError:
        known = ", ".join(sorted(MATERIALS))
        raise ValueError(
            f"Material desconocido: {name!r}. Disponibles: {known}"
        ) from None


def volume_to_grams(volume_cm3: float, material: Material) -> float:
    """Convierte un volumen en cm³ a gramos usando la densidad del material."""
    if volume_cm3 < 0:
        raise ValueError("El volumen no puede ser negativo")
    return volume_cm3 * material.density


# --------------------------------------------------------------------------- #
# Trabajo de impresión y cotización
# --------------------------------------------------------------------------- #

@dataclass
class PrintJob:
    """Parámetros de una pieza a cotizar.

    Solo ``weight_grams`` y ``print_hours`` son obligatorios además del
    material. El resto tiene valores por defecto razonables para una
    imprenta pequeña y se pueden ajustar.
    """

    material: str | Material
    weight_grams: float
    print_hours: float
    quantity: int = 1
    # Costo de operar la impresora por hora (electricidad + amortización).
    machine_rate_per_hour: float = 0.5
    # Horas de trabajo humano: preparar archivo, retirar pieza, limpiar, etc.
    labor_hours: float = 0.25
    labor_rate_per_hour: float = 10.0
    # Porcentaje de impresiones que salen mal y hay que repetir (0-100).
    failure_rate_percent: float = 5.0
    # Margen de ganancia sobre el costo (0-100+).
    margin_percent: float = 30.0
    # Impuesto a aplicar sobre el precio final (0-100). 0 = sin impuesto.
    tax_percent: float = 0.0

    def __post_init__(self) -> None:
        if isinstance(self.material, str):
            self.material = get_material(self.material)
        if self.weight_grams < 0:
            raise ValueError("El peso no puede ser negativo")
        if self.print_hours < 0:
            raise ValueError("Las horas de impresión no pueden ser negativas")
        if self.quantity < 1:
            raise ValueError("La cantidad debe ser al menos 1")
        if self.machine_rate_per_hour < 0:
            raise ValueError("La tarifa de máquina no puede ser negativa")
        if self.labor_hours < 0 or self.labor_rate_per_hour < 0:
            raise ValueError("La mano de obra no puede ser negativa")
        if not 0 <= self.failure_rate_percent < 100:
            raise ValueError("La tasa de fallo debe estar entre 0 y 99.99")
        if self.margin_percent < 0:
            raise ValueError("El margen no puede ser negativo")
        if self.tax_percent < 0:
            raise ValueError("El impuesto no puede ser negativo")


@dataclass
class CostBreakdown:
    """Desglose de costos de un trabajo. Todos los montos son por el lote
    completo (``quantity`` piezas) salvo ``unit_price`` y
    ``unit_price_with_tax``."""

    material_cost: float
    machine_cost: float
    labor_cost: float
    failure_cost: float
    margin: float
    tax: float
    quantity: int = 1
    lines: list[tuple[str, float]] = field(default_factory=list, repr=False)

    @property
    def production_cost(self) -> float:
        """Costo de producir el lote, sin margen ni impuesto."""
        return (
            self.material_cost
            + self.machine_cost
            + self.labor_cost
            + self.failure_cost
        )

    @property
    def price_before_tax(self) -> float:
        return self.production_cost + self.margin

    @property
    def total_with_tax(self) -> float:
        return self.price_before_tax + self.tax

    @property
    def unit_price(self) -> float:
        return self.price_before_tax / self.quantity

    @property
    def unit_price_with_tax(self) -> float:
        return self.total_with_tax / self.quantity


def calculate_cost(job: PrintJob) -> CostBreakdown:
    """Calcula el desglose de costos y el precio de venta de un ``PrintJob``.

    Fórmula:

    1. material  = peso_g / 1000 * precio_kg * cantidad
    2. máquina   = horas * tarifa_máquina * cantidad
    3. mano obra = horas_mano_obra * tarifa_mano_obra * cantidad
    4. fallos    = (material + máquina) * tasa_fallo%
       (si una pieza sale mal se pierde material y tiempo de máquina, pero
       la mano de obra ya está contemplada aparte)
    5. margen    = (1 + 2 + 3 + 4) * margen%
    6. impuesto  = (costo + margen) * impuesto%
    """
    material = job.material
    assert isinstance(material, Material)
    qty = job.quantity

    material_cost = job.weight_grams / 1000 * material.price_per_kg * qty
    machine_cost = job.print_hours * job.machine_rate_per_hour * qty
    labor_cost = job.labor_hours * job.labor_rate_per_hour * qty
    failure_cost = (material_cost + machine_cost) * job.failure_rate_percent / 100

    production = material_cost + machine_cost + labor_cost + failure_cost
    margin = production * job.margin_percent / 100
    tax = (production + margin) * job.tax_percent / 100

    breakdown = CostBreakdown(
        material_cost=material_cost,
        machine_cost=machine_cost,
        labor_cost=labor_cost,
        failure_cost=failure_cost,
        margin=margin,
        tax=tax,
        quantity=qty,
    )
    breakdown.lines = [
        (f"Material ({material.name})", material_cost),
        ("Uso de máquina", machine_cost),
        ("Mano de obra", labor_cost),
        (f"Fallos ({job.failure_rate_percent:g}%)", failure_cost),
        ("Costo de producción", breakdown.production_cost),
        (f"Margen ({job.margin_percent:g}%)", margin),
        ("Precio sin impuesto", breakdown.price_before_tax),
    ]
    if job.tax_percent:
        breakdown.lines += [
            (f"Impuesto ({job.tax_percent:g}%)", tax),
            ("Total con impuesto", breakdown.total_with_tax),
        ]
    return breakdown


def format_breakdown(breakdown: CostBreakdown, currency: str = "$") -> str:
    """Devuelve el desglose como texto alineado listo para imprimir."""
    width = max(len(label) for label, _ in breakdown.lines)
    rows = [f"{label:<{width}}  {currency}{amount:>10.2f}" for label, amount in breakdown.lines]
    if breakdown.quantity > 1:
        rows.append("")
        rows.append(
            f"{'Precio por unidad':<{width}}  {currency}{breakdown.unit_price_with_tax:>10.2f}"
            f"  ({breakdown.quantity} piezas)"
        )
    return "\n".join(rows)


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="print_cost_calculator",
        description="Calcula el costo y precio de venta de una pieza impresa en 3D.",
    )
    parser.add_argument(
        "--material", "-m", default="PLA",
        help=f"material (disponibles: {', '.join(sorted(MATERIALS))}); por defecto PLA",
    )
    weight = parser.add_mutually_exclusive_group(required=True)
    weight.add_argument("--peso", "-p", type=float, help="peso de la pieza en gramos")
    weight.add_argument("--volumen", "-v", type=float, help="volumen de la pieza en cm³ (se convierte a gramos con la densidad del material)")
    parser.add_argument("--horas", "-t", type=float, required=True, help="horas de impresión")
    parser.add_argument("--cantidad", "-n", type=int, default=1, help="número de piezas (por defecto 1)")
    parser.add_argument("--precio-kg", type=float, help="sobrescribe el precio por kg del material")
    parser.add_argument("--tarifa-maquina", type=float, default=0.5, help="costo por hora de máquina (por defecto 0.5)")
    parser.add_argument("--horas-mano-obra", type=float, default=0.25, help="horas de trabajo manual por pieza (por defecto 0.25)")
    parser.add_argument("--tarifa-mano-obra", type=float, default=10.0, help="costo por hora de mano de obra (por defecto 10)")
    parser.add_argument("--fallos", type=float, default=5.0, help="porcentaje de impresiones fallidas (por defecto 5)")
    parser.add_argument("--margen", type=float, default=30.0, help="margen de ganancia en porcentaje (por defecto 30)")
    parser.add_argument("--iva", type=float, default=0.0, help="impuesto en porcentaje (por defecto 0)")
    parser.add_argument("--moneda", default="$", help="símbolo de moneda para mostrar (por defecto $)")
    return parser


def job_from_args(args: argparse.Namespace) -> PrintJob:
    material = get_material(args.material)
    if args.precio_kg is not None:
        material = Material(material.name, args.precio_kg, material.density)
    weight = args.peso if args.peso is not None else volume_to_grams(args.volumen, material)
    return PrintJob(
        material=material,
        weight_grams=weight,
        print_hours=args.horas,
        quantity=args.cantidad,
        machine_rate_per_hour=args.tarifa_maquina,
        labor_hours=args.horas_mano_obra,
        labor_rate_per_hour=args.tarifa_mano_obra,
        failure_rate_percent=args.fallos,
        margin_percent=args.margen,
        tax_percent=args.iva,
    )


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        job = job_from_args(args)
    except ValueError as exc:
        parser.error(str(exc))
    print(format_breakdown(calculate_cost(job), currency=args.moneda))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
