"use client";

interface SearchFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  categories: string[];
  types: string[];
}

export function SearchFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  categories,
  types,
}: SearchFilterProps) {
  return (
    <div className="space-y-3">
      <input
        type="search"
        placeholder="поиск по португальскому или русскому..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
        >
          <option value="">все категории</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
        >
          <option value="">все типы</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
