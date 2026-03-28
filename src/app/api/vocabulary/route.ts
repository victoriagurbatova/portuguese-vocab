import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseCSVToWords } from "@/lib/csvParser";
import { MOCK_WORDS } from "@/lib/mockData";

const CSV_PATH = path.join(process.cwd(), "data", "vocabulary.csv");

export async function GET() {
  try {
    if (fs.existsSync(CSV_PATH)) {
      const raw = fs.readFileSync(CSV_PATH, "utf-8");
      const words = parseCSVToWords(raw);
      if (words.length > 0) {
        return NextResponse.json({ words, source: "csv" });
      }
    }
  } catch {
    // fall through to mock
  }
  return NextResponse.json({ words: MOCK_WORDS, source: "mock" });
}
