"use client";

import { useMemo, useState } from "react";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useProgress } from "@/hooks/useProgress";
import { Flashcard } from "@/components/Flashcard";
import { TypedAnswer } from "@/components/TypedAnswer";
import { isAnswerCorrect } from "@/lib/validation";
import { Word, StudyMode } from "@/lib/types";
import Link from "next/link";

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const MODES: { value: StudyMode; label: string }[] = [
  { value: "pt-ru-reveal", label: "PT → RU (показать ответ)" },
  { value: "ru-pt-reveal", label: "RU → PT (показать ответ)" },
  { value: "pt-ru-typed", label: "PT → RU (ввод ответа)" },
  { value: "ru-pt-typed", label: "RU → PT (ввод ответа)" },
];

export default function StudyPage() {
  const { words, loading } = useVocabulary();
  const { recordSeen, recordTyped } = useProgress();
  const [scope, setScope] = useState<"all" | "category" | "type">("all");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [mode, setMode] = useState<StudyMode>("pt-ru-reveal");
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionUnknown, setSessionUnknown] = useState(0);
  const [sessionTypedCorrect, setSessionTypedCorrect] = useState(0);
  const [sessionTypedWrong, setSessionTypedWrong] = useState(0);

  const categories = useMemo(
    () => Array.from(new Set(words.map((w) => w.category).filter(Boolean))).sort(),
    [words]
  );
  const types = useMemo(
    () => Array.from(new Set(words.map((w) => w.type).filter(Boolean))).sort(),
    [words]
  );

  const pool = useMemo(() => {
    let list = words;
    if (scope === "category" && category) list = list.filter((w) => w.category === category);
    if (scope === "type" && typeFilter) list = list.filter((w) => w.type === typeFilter);
    return list;
  }, [words, scope, category, typeFilter]);

  const startSession = () => {
    const shuffled = shuffle(pool);
    if (shuffled.length === 0) return;
    setSessionWords(shuffled);
    setIndex(0);
    setRevealed(false);
    setSessionComplete(false);
    setSessionKnown(0);
    setSessionUnknown(0);
    setSessionTypedCorrect(0);
    setSessionTypedWrong(0);
    setStarted(true);
  };

  const currentWord = sessionWords[index];
  const progress = sessionWords.length ? `${index + 1} / ${sessionWords.length}` : "";
  const isRevealMode = mode === "pt-ru-reveal" || mode === "ru-pt-reveal";
  const isTypedMode = mode === "pt-ru-typed" || mode === "ru-pt-typed";

  const handleNext = (known?: boolean) => {
    if (isRevealMode && known !== undefined) {
      recordSeen(currentWord.id, known);
      if (known) setSessionKnown((k) => k + 1);
      else setSessionUnknown((u) => u + 1);
    }
    setRevealed(false);
    if (index + 1 >= sessionWords.length) {
      setSessionComplete(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleTypedSubmit = (correct: boolean) => {
    recordTyped(currentWord.id, correct);
    if (correct) setSessionTypedCorrect((c) => c + 1);
    else setSessionTypedWrong((w) => w + 1);
    setRevealed(false);
    if (index + 1 >= sessionWords.length) {
      setSessionComplete(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-stone-500">загрузка...</div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Настройка сессии</h1>

        <div>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Что учить</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setScope("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                scope === "all"
                  ? "bg-teal-600 text-white"
                  : "border border-stone-300 dark:border-stone-600"
              }`}
            >
              все слова
            </button>
            <button
              onClick={() => setScope("category")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                scope === "category"
                  ? "bg-teal-600 text-white"
                  : "border border-stone-300 dark:border-stone-600"
              }`}
            >
              категория
            </button>
            <button
              onClick={() => setScope("type")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                scope === "type"
                  ? "bg-teal-600 text-white"
                  : "border border-stone-300 dark:border-stone-600"
              }`}
            >
              тип
            </button>
          </div>
          {scope === "category" && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
            >
              <option value="">выберите категорию</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          {scope === "type" && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-2 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-sm"
            >
              <option value="">выберите тип</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">Режим</p>
          <div className="flex flex-col gap-2">
            {MODES.map((m) => (
              <label key={m.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value={m.value}
                  checked={mode === m.value}
                  onChange={() => setMode(m.value)}
                  className="rounded border-stone-400 text-teal-600"
                />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <p className="text-sm text-stone-500">
          слов в выборке: {pool.length}
        </p>

        <button
          onClick={startSession}
          disabled={pool.length === 0}
          className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          начать
        </button>
      </div>
    );
  }

  if (sessionComplete) {
    const total = sessionWords.length;
    const known = sessionKnown + sessionTypedCorrect;
    const unknown = sessionUnknown + sessionTypedWrong;
    return (
      <div className="space-y-6 text-center py-8">
        <h2 className="text-xl font-semibold">Сессия завершена</h2>
        <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 space-y-2">
          <p>карточек: {total}</p>
          {isRevealMode && (
            <>
              <p className="text-green-600 dark:text-green-400">знаю: {sessionKnown}</p>
              <p className="text-red-600 dark:text-red-400">не знаю: {sessionUnknown}</p>
            </>
          )}
          {isTypedMode && (
            <>
              <p className="text-green-600 dark:text-green-400">верно: {sessionTypedCorrect}</p>
              <p className="text-red-600 dark:text-red-400">неверно: {sessionTypedWrong}</p>
            </>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={startSession}
            className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700"
          >
            ещё раз
          </button>
          <button
            onClick={() => {
              setStarted(false);
              setSessionComplete(false);
              setSessionWords([]);
            }}
            className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            к настройкам
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-stone-500">
        <span>{progress}</span>
        <Link href="/study" className="text-teal-600 dark:text-teal-400 hover:underline">
          выйти
        </Link>
      </div>

      {isRevealMode && (
        <Flashcard
          key={currentWord.id}
          word={currentWord}
          frontLabel={mode === "pt-ru-reveal" ? "português" : "русский"}
          frontText={mode === "pt-ru-reveal" ? currentWord.portuguese : currentWord.russian}
          showPronunciation={mode === "pt-ru-reveal"}
          backLabel={mode === "pt-ru-reveal" ? "русский" : "português"}
          backText={mode === "pt-ru-reveal" ? currentWord.russian : currentWord.portuguese}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onKnow={() => handleNext(true)}
          onDontKnow={() => handleNext(false)}
        />
      )}

      {isTypedMode && (
        <TypedAnswer
          key={currentWord.id}
          word={currentWord}
          questionLabel={mode === "pt-ru-typed" ? "português" : "русский"}
          questionText={mode === "pt-ru-typed" ? currentWord.portuguese : currentWord.russian}
          answerLabel={mode === "pt-ru-typed" ? "русский" : "português"}
          correctAnswer={mode === "pt-ru-typed" ? currentWord.russian : currentWord.portuguese}
          validate={isAnswerCorrect}
          onSubmit={handleTypedSubmit}
        />
      )}
    </div>
  );
}
