"use client";

import { useState, FormEvent } from "react";
import { Word } from "@/lib/types";

interface TypedAnswerProps {
  word: Word;
  questionLabel: string;
  questionText: string;
  answerLabel: string;
  correctAnswer: string;
  validate: (user: string, correct: string) => boolean;
  onSubmit: (correct: boolean) => void;
}

export function TypedAnswer({
  word,
  questionLabel,
  questionText,
  answerLabel,
  correctAnswer,
  validate,
  onSubmit,
}: TypedAnswerProps) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (checked) {
      onSubmit(correct);
      return;
    }
    const ok = validate(value, correctAnswer);
    setCorrect(ok);
    setChecked(true);
  };

  return (
    <div className="rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
          {questionLabel}
        </p>
        <p className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
          {questionText}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!checked ? (
            <>
              <label className="block text-sm text-stone-600 dark:text-stone-400">
                {answerLabel}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="введите ответ..."
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                проверить
              </button>
            </>
          ) : (
            <>
              <div
                className={`p-4 rounded-xl ${
                  correct
                    ? "bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400"
                }`}
              >
                <p className="font-medium">
                  {correct ? "верно" : "неверно"}
                </p>
                {!correct && (
                  <p className="mt-1 text-sm">
                    {answerLabel}: {correctAnswer}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
              >
                дальше
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
