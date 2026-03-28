"use client";

import { Word } from "@/lib/types";

interface FlashcardProps {
  word: Word;
  frontLabel: string;
  frontText: string;
  showPronunciation?: boolean;
  backLabel: string;
  backText: string;
  revealed: boolean;
  onReveal: () => void;
  onKnow: () => void;
  onDontKnow: () => void;
}

export function Flashcard({
  word,
  frontLabel,
  frontText,
  showPronunciation,
  backLabel,
  backText,
  revealed,
  onReveal,
  onKnow,
  onDontKnow,
}: FlashcardProps) {
  return (
    <div className="rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8 min-h-[200px] flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">
            {frontLabel}
          </p>
          <p className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
            {frontText}
          </p>
          {showPronunciation && word.pronunciation_ru && (
            <p className="mt-2 text-lg text-stone-500 italic">
              [{word.pronunciation_ru}]
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {!revealed ? (
            <button
              onClick={onReveal}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
            >
              показать ответ
            </button>
          ) : (
            <div className="pt-4 border-t border-stone-200 dark:border-stone-600">
              <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
                {backLabel}
              </p>
              <p className="text-xl sm:text-2xl text-stone-700 dark:text-stone-300">
                {backText}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onKnow}
              type="button"
              aria-label="знаю"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              <span className="w-6 h-6 flex items-center justify-center" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="hidden sm:inline">знаю</span>
            </button>
            <button
              onClick={onDontKnow}
              type="button"
              aria-label="не знаю"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              <span className="w-6 h-6 flex items-center justify-center" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
              <span className="hidden sm:inline">не знаю</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
