import { Word } from "./types";

export const MOCK_WORDS: Word[] = [
  {
    id: "1",
    portuguese: "olá",
    pronunciation_ru: "ола",
    russian: "привет",
    category: "приветствия",
    examples: "Olá! Como vai?",
    type: "regular",
  },
  {
    id: "2",
    portuguese: "obrigado",
    pronunciation_ru: "обригаду",
    russian: "спасибо",
    category: "приветствия",
    examples: "Obrigado pela ajuda.",
    type: "regular",
  },
  {
    id: "3",
    portuguese: "bom dia",
    pronunciation_ru: "бон диа",
    russian: "доброе утро",
    category: "приветствия",
    examples: "Bom dia!",
    type: "phrase",
  },
  {
    id: "4",
    portuguese: "água",
    pronunciation_ru: "агуа",
    russian: "вода",
    category: "еда и напитки",
    examples: "Uma garrafa de água, por favor.",
    type: "regular",
  },
  {
    id: "5",
    portuguese: "país",
    pronunciation_ru: "паис",
    russian: "страна",
    category: "география",
    examples: "O Brasil é um país grande.",
    type: "country",
  },
];
