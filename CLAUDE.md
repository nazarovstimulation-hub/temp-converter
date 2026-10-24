# Project notes

## Company data (owner's company)

The owner's company is **SYNTH MASHI, S.L.** (Spain, Alcobendas/Madrid).
Full legal details live in `company/SYNTH_MASHI_SL.md` (human-readable) and
`company/company.json` (machine-readable). Read those files whenever a task
needs company details for a website (footer, contacts, Aviso Legal, privacy
policy, invoices, etc.) instead of asking the user again.

Key facts: CIF B05675947 (VAT: ESB05675947), Registro Mercantil de Madrid
hoja M-898556, e-mail exp.span.group@gmail.com, phone +34 634 118 579.

Fields still missing (tomo/folio/inscripción of the registry entry, website
domain) are marked as `null` / "дополнить"; ask the user for them only when a
task actually needs one. The administrator's personal identifiers are
deliberately not stored in this repository.
