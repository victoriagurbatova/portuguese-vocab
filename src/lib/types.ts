export interface Word {
  id: string;
  portuguese: string;
  pronunciation_ru: string;
  russian: string;
  category: string;
  examples: string;
  type: string;
}

export interface WordProgress {
  times_seen: number;
  times_known: number;
  times_unknown: number;
  times_typed_correct: number;
  times_typed_wrong: number;
  last_seen_at: string | null;
}

export type StudyMode =
  | "pt-ru-reveal"
  | "ru-pt-reveal"
  | "pt-ru-typed"
  | "ru-pt-typed";

export type StudyScope = "all" | "category" | "type";
