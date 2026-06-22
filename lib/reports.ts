export function buildCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>) { return [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))].join('\n'); }
export function reportMime(format: 'PDF' | 'EXCEL') { return format === 'EXCEL' ? 'text/csv' : 'application/json'; }
