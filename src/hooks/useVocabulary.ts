"use client";

import { useState, useEffect } from "react";
import { Word } from "@/lib/types";

export function useVocabulary() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"csv" | "mock" | null>(null);

  useEffect(() => {
    fetch("/api/vocabulary")
      .then((r) => r.json())
      .then((data: { words: Word[]; source: string }) => {
        setWords(data.words);
        setSource(data.source as "csv" | "mock");
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, []);

  return { words, loading, source };
}
