"use client";

import { useCallback, useState, useEffect } from "react";
import { WordProgress } from "@/lib/types";

const STORAGE_KEY = "portuguese-vocab-progress";

function loadProgress(): Record<string, WordProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, WordProgress>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, WordProgress>>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const getProgress = useCallback(
    (wordId: string): WordProgress => {
      return (
        progress[wordId] ?? {
          times_seen: 0,
          times_known: 0,
          times_unknown: 0,
          times_typed_correct: 0,
          times_typed_wrong: 0,
          last_seen_at: null,
        }
      );
    },
    [progress]
  );

  const recordSeen = useCallback((wordId: string, known: boolean) => {
    setProgress((prev) => {
      const next = { ...prev };
      const p = next[wordId] ?? {
        times_seen: 0,
        times_known: 0,
        times_unknown: 0,
        times_typed_correct: 0,
        times_typed_wrong: 0,
        last_seen_at: null,
      };
      next[wordId] = {
        ...p,
        times_seen: p.times_seen + 1,
        times_known: p.times_known + (known ? 1 : 0),
        times_unknown: p.times_unknown + (known ? 0 : 1),
        last_seen_at: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const recordTyped = useCallback((wordId: string, correct: boolean) => {
    setProgress((prev) => {
      const next = { ...prev };
      const p = next[wordId] ?? {
        times_seen: 0,
        times_known: 0,
        times_unknown: 0,
        times_typed_correct: 0,
        times_typed_wrong: 0,
        last_seen_at: null,
      };
      next[wordId] = {
        ...p,
        times_typed_correct: p.times_typed_correct + (correct ? 1 : 0),
        times_typed_wrong: p.times_typed_wrong + (correct ? 0 : 1),
        last_seen_at: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  return { getProgress, recordSeen, recordTyped, progress };
}
