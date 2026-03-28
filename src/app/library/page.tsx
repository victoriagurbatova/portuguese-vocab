"use client";

import { useMemo, useState } from "react";
import { useVocabulary } from "@/hooks/useVocabulary";
import { SearchFilter } from "@/components/SearchFilter";
import { CsvUpload } from "@/components/CsvUpload";
import { Word } from "@/lib/types";

function filterWords(
  words: Word[],
  search: string,
  category: string,
  typeFilter: string
): Word[] {
  const q = search.trim().toLowerCase();
  return words.filter((w) => {
    const matchSearch =
      !q ||
      w.portuguese.toLowerCase().includes(q) ||
      w.russian.toLowerCase().includes(q);
    const matchCat = !category || w.category === category;
    const matchType = !typeFilter || w.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });
}

export default function LibraryPage() {
  const { words, loading, source } = useVocabulary();
  const [uploadedWords, setUploadedWords] = useState<Word[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const wordsToShow = uploadedWords ?? words;
  const currentSource = uploadedWords ? "csv" : source;

  const categories = useMemo(
    () => Array.from(new Set(wordsToShow.map((w) => w.category).filter(Boolean))).sort(),
    [wordsToShow]
  );
  const types = useMemo(
    () => Array.from(new Set(wordsToShow.map((w) => w.type).filter(Boolean))).sort(),
    [wordsToShow]
  );

  const filtered = useMemo(
    () => filterWords(wordsToShow, search, category, typeFilter),
    [wordsToShow, search, category, typeFilter]
  );

  return (
    <div className="space-y-6">
      <CsvUpload onUpload={(newWords) => setUploadedWords(newWords)} />

      {loading && (
        <div className="py-12 text-center text-stone-500">
          загрузка слов...
        </div>
      )}

      {!loading && wordsToShow.length === 0 && (
        <div className="py-12 text-center space-y-3">
          <p className="text-stone-600 dark:text-stone-400">
            слов нет. загрузите CSV через кнопку выше или положите файл в папку <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">data/</code> как <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">vocabulary.csv</code>.
          </p>
        </div>
      )}

      {!loading && wordsToShow.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                Библиотека
              </h1>
              {uploadedWords && (
                <p className="mt-2 text-sm text-teal-700 dark:text-teal-300">
                  Используется загруженный CSV-файл.
                </p>
              )}
            </div>
            <div className="text-sm text-stone-500">
              {filtered.length} из {wordsToShow.length}
              {currentSource === "mock" && (
                <span className="ml-1 text-amber-600 dark:text-amber-400">(mock)</span>
              )}
            </div>
          </div>

          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            categories={categories}
            types={types}
          />

          {uploadedWords && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-200">
              Загружен пользовательский CSV. <button
                type="button"
                onClick={() => setUploadedWords(null)}
                className="ml-2 rounded-full border border-teal-600 px-3 py-1 text-teal-700 hover:bg-teal-100 dark:border-teal-500 dark:text-teal-200 dark:hover:bg-teal-900/40"
              >
                Вернуться к файлу из проекта
              </button>
            </div>
          )}

          <ul className="space-y-2">
            {filtered.map((w) => (
              <li
                key={w.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {w.portuguese}
                  </span>
                  {w.pronunciation_ru && (
                    <span className="text-sm text-stone-500 italic">
                      [{w.pronunciation_ru}]
                    </span>
                  )}
                  {(w.category || w.type) && (
                    <span className="text-xs text-stone-400">
                      {[w.category, w.type].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-stone-600 dark:text-stone-400">
                  {w.russian}
                </p>
                {w.examples && (
                  <p className="mt-2 text-sm text-stone-500 italic">
                    {w.examples}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <p className="text-center text-stone-500 py-8">
              ничего не найдено по фильтрам
            </p>
          )}
        </div>
      )}
    </div>
  );
}
