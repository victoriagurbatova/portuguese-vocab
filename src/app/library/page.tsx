"use client";

import { useMemo, useState } from "react";
import { useVocabulary } from "@/hooks/useVocabulary";
import { SearchFilter } from "@/components/SearchFilter";
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(words.map((w) => w.category).filter(Boolean))).sort(),
    [words]
  );
  const types = useMemo(
    () => Array.from(new Set(words.map((w) => w.type).filter(Boolean))).sort(),
    [words]
  );

  const filtered = useMemo(
    () => filterWords(words, search, category, typeFilter),
    [words, search, category, typeFilter]
  );

  if (loading) {
    return (
      <div className="py-12 text-center text-stone-500">
        загрузка слов...
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-stone-600 dark:text-stone-400">
          слов нет. добавьте CSV в папку <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">data/</code> (файл <code className="bg-stone-200 dark:bg-stone-700 px-1 rounded">vocabulary.csv</code>).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Библиотека
        </h1>
        <span className="text-sm text-stone-500">
          {filtered.length} из {words.length}
          {source === "mock" && (
            <span className="ml-1 text-amber-600 dark:text-amber-400">
              (mock)
            </span>
          )}
        </span>
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
  );
}
