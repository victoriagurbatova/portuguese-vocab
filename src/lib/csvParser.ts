import { Word } from "./types";

/** Split CSV text into rows; newlines inside quoted fields do not start a new row. */
function splitCSVRows(text: string): string[] {
  const rows: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      current += c;
    } else if ((c === "\n" || c === "\r") && !inQuotes) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      rows.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  if (current.trim()) rows.push(current);
  return rows;
}

/** Parse one CSV row into fields; commas inside quoted fields are not separators. */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      current += c;
    } else if (c === "," && !inQuotes) {
      result.push(unquoteField(current.trim()));
      current = "";
    } else {
      current += c;
    }
  }
  result.push(unquoteField(current.trim()));
  return result;
}

function unquoteField(s: string): string {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/""/g, '"');
  }
  return s;
}

export function parseCSVToWords(csvText: string): Word[] {
  const lines = splitCSVRows(csvText).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]).map((h) => h.toLowerCase().trim());
  const idIdx = headers.indexOf("id");
  const ptIdx = headers.indexOf("portuguese");
  const pronIdx = headers.indexOf("pronunciation_ru");
  const ruIdx = headers.indexOf("russian");
  const catIdx = headers.indexOf("category");
  const exIdx = headers.indexOf("examples");
  const typeIdx = headers.indexOf("type");

  if (ptIdx === -1 || ruIdx === -1) return [];

  const words: Word[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVRow(lines[i]);
    const id = idIdx >= 0 ? ((cells[idIdx] ?? "").trim() || `row-${i}`) : `row-${i}`;
    const portuguese = (cells[ptIdx] ?? "").trim();
    const russian = (cells[ruIdx] ?? "").trim();
    if (!portuguese || !russian) continue;

    words.push({
      id,
      portuguese,
      pronunciation_ru: (cells[pronIdx] ?? "").trim(),
      russian,
      category: (cells[catIdx] ?? "").trim(),
      examples: (cells[exIdx] ?? "").trim(),
      type: (cells[typeIdx] ?? "").trim(),
    });
  }
  return words;
}
