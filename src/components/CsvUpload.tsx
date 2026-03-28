"use client";

import { useRef, useState, ChangeEvent } from "react";
import { Word } from "@/lib/types";
import { parseCSVToWordsWithValidation } from "@/lib/csvParser";

interface CsvUploadProps {
  onUpload: (words: Word[]) => void;
}

export function CsvUpload({ onUpload }: CsvUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Пожалуйста, выберите файл с расширением .csv.");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const result = parseCSVToWordsWithValidation(text);
      if (result.error) {
        setError(result.error);
      } else {
        onUpload(result.words);
        setSuccess(`Файл ${file.name} загружен — ${result.words.length} слов.`);
      }
    } catch (err) {
      setError("Не удалось прочитать файл. Попробуйте ещё раз.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900/90">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Загрузить CSV
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Можно загрузить файл CSV прямо из браузера.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition">
            Upload CSV
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 transition dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Формат файла
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700 dark:bg-stone-950 dark:text-stone-200">
          <p className="font-medium">Требуемый формат CSV:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Обязательные колонки: <code>portuguese</code>, <code>russian</code></li>
            <li>Опциональные: <code>id</code>, <code>pronunciation_ru</code>, <code>category</code>, <code>examples</code>, <code>type</code></li>
            <li>Разделитель — запятая</li>
            <li>Текстовые поля с запятыми берите в двойные кавычки</li>
          </ul>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-stone-900 p-3 text-xs text-stone-100 dark:bg-stone-800">
id,portuguese,pronunciation_ru,russian,category,examples,type
1,olá,ола,привет,приветствия,"Olá! Como vai?",regular
2,água,агуа,вода,напитки,"Uma água, por favor.",regular
          </pre>
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      )}
    </div>
  );
}
