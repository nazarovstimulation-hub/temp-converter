# Project notes

## Company data (owner's company)

The owner's company is **SYNTH MASHI, S.L.** (Spain, Alcobendas/Madrid).
Full legal details live in `company/SYNTH_MASHI_SL.md` (human-readable) and
`company/company.json` (machine-readable). Read those files whenever a task
needs company details for a website (footer, contacts, Aviso Legal, privacy
policy, invoices, etc.) instead of asking the user again.

Fields still missing from the source document (NIF/CIF, Registro Mercantil
data, administrator, email, phone, domain) are marked as `null` / "дополнить";
ask the user for them only when a task actually needs one.
