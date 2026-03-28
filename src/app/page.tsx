import Link from "next/link";

export default function Home() {
  return (
    <div className="py-12 text-center space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
        Portuguese Vocab
      </h1>
      <p className="text-stone-600 dark:text-stone-400">
        карточки для изучения португальских слов
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/library"
          className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
        >
          Библиотека
        </Link>
        <Link
          href="/study"
          className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          Учить
        </Link>
        <Link
          href="/stats"
          className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          Статистика
        </Link>
      </div>
    </div>
  );
}
