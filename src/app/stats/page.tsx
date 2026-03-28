"use client";

import { useVocabulary } from "@/hooks/useVocabulary";
import { useProgress } from "@/hooks/useProgress";
import { useMemo } from "react";

export default function StatsPage() {
  const { words, loading } = useVocabulary();
  const { progress } = useProgress();

  const stats = useMemo(() => {
    const total = words.length;
    let studied = 0;
    let known = 0;
    let unknown = 0;
    let typedCorrect = 0;
    let typedWrong = 0;

    const difficulty: { wordId: string; portuguese: string; russian: string; unknownRate: number }[] = [];

    for (const w of words) {
      const p = progress[w.id];
      if (!p) continue;
      if (p.times_seen > 0 || p.times_typed_correct + p.times_typed_wrong > 0) {
        studied++;
        known += p.times_known;
        unknown += p.times_unknown;
        typedCorrect += p.times_typed_correct;
        typedWrong += p.times_typed_wrong;

        const totalSeen = p.times_known + p.times_unknown;
        if (totalSeen >= 2 && p.times_unknown > 0) {
          difficulty.push({
            wordId: w.id,
            portuguese: w.portuguese,
            russian: w.russian,
            unknownRate: p.times_unknown / totalSeen,
          });
        }
      }
    }

    difficulty.sort((a, b) => b.unknownRate - a.unknownRate);
    const mostDifficult = difficulty.slice(0, 10);

    const typedTotal = typedCorrect + typedWrong;
    const typedAccuracy = typedTotal > 0 ? Math.round((typedCorrect / typedTotal) * 100) : null;

    return {
      total,
      studied,
      known,
      unknown,
      typedCorrect,
      typedWrong,
      typedAccuracy,
      mostDifficult,
    };
  }, [words, progress]);

  if (loading) {
    return (
      <div className="py-12 text-center text-stone-500">загрузка...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
        Статистика
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
          <p className="text-sm text-stone-500">всего слов</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
          <p className="text-sm text-stone-500">изучено (хотя бы раз)</p>
          <p className="text-2xl font-semibold">{stats.studied}</p>
        </div>
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
          <p className="text-sm text-stone-500">знаю (режим показа)</p>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
            {stats.known}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50">
          <p className="text-sm text-stone-500">не знаю (режим показа)</p>
          <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
            {stats.unknown}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 sm:col-span-2">
          <p className="text-sm text-stone-500">точность ввода (режим ввода ответа)</p>
          <p className="text-2xl font-semibold">
            {stats.typedAccuracy !== null ? `${stats.typedAccuracy}%` : "—"}
          </p>
          {stats.typedCorrect + stats.typedWrong > 0 && (
            <p className="text-sm text-stone-500 mt-1">
              {stats.typedCorrect} верно / {stats.typedWrong} неверно
            </p>
          )}
        </div>
      </div>

      {stats.mostDifficult.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-3">
            Сложные слова
          </h2>
          <ul className="space-y-2">
            {stats.mostDifficult.map((d) => (
              <li
                key={d.wordId}
                className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 flex justify-between items-center"
              >
                <span>
                  <strong>{d.portuguese}</strong> — {d.russian}
                </span>
                <span className="text-sm text-stone-500">
                  {Math.round(d.unknownRate * 100)}% ошибок
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.studied === 0 && (
        <p className="text-center text-stone-500 py-8">
          пока нет данных. позанимайтесь в режиме «Учить».
        </p>
      )}
    </div>
  );
}
