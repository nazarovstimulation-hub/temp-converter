import pytest

from print_cost_calculator import (
    MATERIALS,
    Material,
    PrintJob,
    calculate_cost,
    format_breakdown,
    get_material,
    main,
    volume_to_grams,
)


# --------------------------------------------------------------------------- #
# Materiales
# --------------------------------------------------------------------------- #

def test_get_material_is_case_insensitive():
    assert get_material("pla") is MATERIALS["PLA"]
    assert get_material("  Petg ") is MATERIALS["PETG"]


def test_get_material_unknown_raises():
    with pytest.raises(ValueError, match="Material desconocido"):
        get_material("MADERA")


def test_volume_to_grams_uses_density():
    pla = MATERIALS["PLA"]  # 1.24 g/cm³
    assert volume_to_grams(10, pla) == pytest.approx(12.4)


def test_volume_to_grams_negative_raises():
    with pytest.raises(ValueError):
        volume_to_grams(-1, MATERIALS["PLA"])


# --------------------------------------------------------------------------- #
# Cálculo
# --------------------------------------------------------------------------- #

def _bare_job(**overrides):
    """Trabajo con todos los extras en cero para aislar cada componente."""
    params = dict(
        material="PLA",
        weight_grams=100,
        print_hours=2,
        machine_rate_per_hour=0,
        labor_hours=0,
        labor_rate_per_hour=0,
        failure_rate_percent=0,
        margin_percent=0,
        tax_percent=0,
    )
    params.update(overrides)
    return PrintJob(**params)


def test_material_cost_only():
    # 100 g de PLA a 20/kg = 2.00
    quote = calculate_cost(_bare_job())
    assert quote.material_cost == pytest.approx(2.0)
    assert quote.production_cost == pytest.approx(2.0)
    assert quote.total_with_tax == pytest.approx(2.0)


def test_machine_cost():
    quote = calculate_cost(_bare_job(machine_rate_per_hour=0.5))
    assert quote.machine_cost == pytest.approx(1.0)  # 2 h * 0.5


def test_labor_cost():
    quote = calculate_cost(_bare_job(labor_hours=0.5, labor_rate_per_hour=12))
    assert quote.labor_cost == pytest.approx(6.0)


def test_failure_rate_applies_to_material_and_machine_only():
    quote = calculate_cost(
        _bare_job(
            machine_rate_per_hour=0.5,  # máquina = 1.0
            labor_hours=1, labor_rate_per_hour=10,  # mano de obra = 10
            failure_rate_percent=10,
        )
    )
    # (material 2.0 + máquina 1.0) * 10% = 0.30; la mano de obra no cuenta
    assert quote.failure_cost == pytest.approx(0.3)
    assert quote.production_cost == pytest.approx(13.3)


def test_margin_and_tax():
    quote = calculate_cost(_bare_job(margin_percent=50, tax_percent=21))
    assert quote.margin == pytest.approx(1.0)  # 2.0 * 50%
    assert quote.price_before_tax == pytest.approx(3.0)
    assert quote.tax == pytest.approx(0.63)  # 3.0 * 21%
    assert quote.total_with_tax == pytest.approx(3.63)


def test_quantity_scales_costs_and_unit_price():
    quote = calculate_cost(_bare_job(quantity=4, margin_percent=100))
    assert quote.material_cost == pytest.approx(8.0)
    assert quote.price_before_tax == pytest.approx(16.0)
    assert quote.unit_price == pytest.approx(4.0)
    assert quote.unit_price_with_tax == pytest.approx(4.0)


def test_custom_material_object():
    gold = Material("ORO", price_per_kg=1000, density=19.3)
    quote = calculate_cost(_bare_job(material=gold, weight_grams=10))
    assert quote.material_cost == pytest.approx(10.0)


def test_default_job_matches_documented_formula():
    # Valores por defecto: máquina 0.5/h, mano de obra 0.25 h a 10/h,
    # fallos 5 %, margen 30 %, sin impuesto.
    quote = calculate_cost(PrintJob(material="PETG", weight_grams=80, print_hours=6))
    material = 0.08 * 25  # 2.0
    machine = 6 * 0.5  # 3.0
    labor = 0.25 * 10  # 2.5
    failure = (material + machine) * 0.05  # 0.25
    production = material + machine + labor + failure  # 7.75
    assert quote.production_cost == pytest.approx(production)
    assert quote.price_before_tax == pytest.approx(production * 1.3)
    assert quote.tax == 0


@pytest.mark.parametrize(
    "field, value",
    [
        ("weight_grams", -1),
        ("print_hours", -0.5),
        ("quantity", 0),
        ("machine_rate_per_hour", -1),
        ("labor_hours", -1),
        ("failure_rate_percent", 100),
        ("failure_rate_percent", -1),
        ("margin_percent", -5),
        ("tax_percent", -1),
    ],
)
def test_invalid_inputs_raise(field, value):
    with pytest.raises(ValueError):
        _bare_job(**{field: value})


# --------------------------------------------------------------------------- #
# Salida y CLI
# --------------------------------------------------------------------------- #

def test_format_breakdown_hides_tax_when_zero():
    text = format_breakdown(calculate_cost(_bare_job()))
    assert "Material (PLA)" in text
    assert "Impuesto" not in text
    assert "Precio por unidad" not in text


def test_format_breakdown_shows_tax_and_unit_price():
    text = format_breakdown(
        calculate_cost(_bare_job(quantity=3, tax_percent=21)), currency="€"
    )
    assert "Impuesto (21%)" in text
    assert "Total con impuesto" in text
    assert "Precio por unidad" in text
    assert "(3 piezas)" in text
    assert "€" in text


def test_cli_with_weight(capsys):
    assert main(["--material", "pla", "--peso", "100", "--horas", "2",
                 "--tarifa-maquina", "0", "--horas-mano-obra", "0",
                 "--fallos", "0", "--margen", "0"]) == 0
    out = capsys.readouterr().out
    assert "Material (PLA)" in out
    assert "2.00" in out


def test_cli_with_volume_and_price_override(capsys):
    # 10 cm³ de PLA = 12.4 g; a 100/kg = 1.24
    main(["--volumen", "10", "--horas", "1", "--precio-kg", "100",
          "--tarifa-maquina", "0", "--horas-mano-obra", "0",
          "--fallos", "0", "--margen", "0"])
    out = capsys.readouterr().out
    assert "1.24" in out


def test_cli_unknown_material_exits_with_error(capsys):
    with pytest.raises(SystemExit) as exc:
        main(["--material", "madera", "--peso", "10", "--horas", "1"])
    assert exc.value.code == 2
    assert "Material desconocido" in capsys.readouterr().err


def test_cli_requires_weight_or_volume():
    with pytest.raises(SystemExit):
        main(["--horas", "1"])
