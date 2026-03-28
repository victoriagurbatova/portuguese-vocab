import { Word } from "./types";

export interface ParseCSVResult {
  words: Word[];
  error?: string;
}

function splitCSVRows(text: string): { rows: string[]; error?: string } {
  const rows: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        current += c;
      }
    } else if ((c === "\n" || c === "\r") && !inQuotes) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      rows.push(current);
      current = "";
    } else {
      current += c;
    }
  }

  if (inQuotes) {
    return { rows: [], error: "Незакрытая кавычка в CSV. Проверьте формат файла." };
  }

  if (current.trim()) rows.push(current);
  return { rows };
}

function parseCSVRow(row: string): { fields: string[]; error?: string } {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(unquoteField(current.trim()));
      current = "";
    } else {
      current += c;
    }
  }

  if (inQuotes) {
    return { fields: [], error: "Незакрытая кавычка в строке CSV. Проверьте файл." };
  }

  result.push(unquoteField(current.trim()));
  return { fields: result };
}

function unquoteField(s: string): string {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/""/g, '"');
  }
  return s;
}

export function parseCSVToWords(csvText: string): Word[] {
  const { rows } = splitCSVRows(csvText);
  const lines = rows.filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headerParse = parseCSVRow(lines[0]);
  if (headerParse.error) return [];

  const headers = headerParse.fields.map((h) => h.toLowerCase().trim());
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
    if (cells.error) continue;
    const rowFields = cells.fields;
    const id = idIdx >= 0 ? ((rowFields[idIdx] ?? "").trim() || `row-${i}`) : `row-${i}`;
    const portuguese = (rowFields[ptIdx] ?? "").trim();
    const russian = (rowFields[ruIdx] ?? "").trim();
    if (!portuguese || !russian) continue;

    words.push({
      id,
      portuguese,
      pronunciation_ru: (rowFields[pronIdx] ?? "").trim(),
      russian,
      category: (rowFields[catIdx] ?? "").trim(),
      examples: (rowFields[exIdx] ?? "").trim(),
      type: (rowFields[typeIdx] ?? "").trim(),
    });
  }
  return words;
}

export function parseCSVToWordsWithValidation(csvText: string): ParseCSVResult {
  const { rows, error: splitError } = splitCSVRows(csvText);
  if (splitError) return { words: [], error: splitError };

  const lines = rows.filter((l) => l.trim());
  if (lines.length === 0) {
    return { words: [], error: "CSV пустой. Добавьте данные со строками после заголовка." };
  }

  const headerParse = parseCSVRow(lines[0]);
  if (headerParse.error) {
    return { words: [], error: headerParse.error };
  }

  const headers = headerParse.fields.map((h, index) =>
    index === 0 ? h.replace(/^\uFEFF/, "").toLowerCase().trim() : h.toLowerCase().trim()
  );
  if (headers.length < 2) {
    return {
      words: [],
      error: "Неправильный заголовок CSV. Проверьте разделитель и формат файла.",
    };
  }

  const idIdx = headers.indexOf("id");
  const ptIdx = headers.indexOf("portuguese");
  const pronIdx = headers.indexOf("pronunciation_ru");
  const ruIdx = headers.indexOf("russian");
  const catIdx = headers.indexOf("category");
  const exIdx = headers.indexOf("examples");
  const typeIdx = headers.indexOf("type");

  const missingColumns = [];
  if (ptIdx === -1) missingColumns.push("portuguese");
  if (ruIdx === -1) missingColumns.push("russian");
  if (missingColumns.length > 0) {
    return {
      words: [],
      error: `Отсутствуют обязательные колонки: ${missingColumns.join(", ")}. Добавьте их в первую строку.`,
    };
  }

  const words: Word[] = [];
  for (let i = 1; i < lines.length; i++) {
    const rowParse = parseCSVRow(lines[i]);
    if (rowParse.error) {
      return {
        words: [],
        error: `Ошибка в строке ${i + 1}: ${rowParse.error}`,
      };
    }

    const cells = rowParse.fields;
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

  if (words.length === 0) {
    return {
      words: [],
      error: "Файл CSV не содержит ни одной строки со словом и переводом.",
    };
  }

  return { words };
}
