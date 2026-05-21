// Project Gutenberg integration.
// Books are fetched as plain text, header/footer stripped, and passages
// extracted from the body. Tuned for philosophical prose: long sentences,
// section numbers, and the occasional Greek word are fine; tables of
// contents, indexes, and propositional scaffolding are not.

const GUTENBERG_BASE = "https://www.gutenberg.org/cache/epub";
const USER_AGENT =
  "Mozilla/5.0 (compatible; PhilosophyQuiz/1.0; +https://example.com)";

const START_MARKER = /^\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*\s*$/im;
const END_MARKER = /^\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*\*\*\s*$/im;

const textCache = new Map<number, string>();

export async function fetchBookText(id: number): Promise<string> {
  const cached = textCache.get(id);
  if (cached) return cached;

  const url = `${GUTENBERG_BASE}/${id}/pg${id}.txt`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Gutenberg fetch ${id} failed: ${res.status}`);
  const text = await res.text();
  textCache.set(id, text);
  return text;
}

export function stripGutenbergFraming(raw: string): string {
  let body = raw;
  const startMatch = raw.match(START_MARKER);
  if (startMatch && startMatch.index !== undefined) {
    body = raw.slice(startMatch.index + startMatch[0].length);
  }
  const endMatch = body.match(END_MARKER);
  if (endMatch && endMatch.index !== undefined) {
    body = body.slice(0, endMatch.index);
  }
  return body.trim();
}

interface PassageOptions {
  minChars?: number;
  maxChars?: number;
  preferMultiSentence?: boolean;
  form?: "treatise" | "dialogue" | "aphorism" | "essay" | "letters" | "meditation";
  trimFront?: number;
  trimBack?: number;
}

interface ExtractedPassage {
  text: string;
  position: number;
}

export function extractPassage(
  body: string,
  opts: PassageOptions = {}
): ExtractedPassage | null {
  const {
    form = "treatise",
    trimFront = 0.05,
    trimBack = 0.05,
  } = opts;

  // Aphorism / dialogue passages can be shorter; treatise prose wants more.
  const minChars =
    opts.minChars ??
    (form === "aphorism" ? 140 : form === "dialogue" ? 180 : 240);
  const maxChars = opts.maxChars ?? (form === "aphorism" ? 600 : 750);

  const start = Math.floor(body.length * trimFront);
  const end = Math.floor(body.length * (1 - trimBack));
  const trimmed = body.slice(start, end);

  const blocks = trimmed.split(/\n\s*\n+/);

  const candidates: { text: string; index: number }[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const cleaned = cleanBlock(blocks[i]);
    if (!isPassageWorthy(cleaned, minChars, maxChars, form, opts.preferMultiSentence ?? true)) {
      continue;
    }
    candidates.push({ text: cleaned, index: i });
  }

  if (candidates.length === 0) return null;

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    text: chosen.text,
    position: chosen.index / blocks.length,
  };
}

function cleanBlock(block: string): string {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return "";

  const avgLineLen = lines.reduce((s, l) => s + l.length, 0) / lines.length;
  // Aphoristic / dialogue blocks (short lines) — keep the line breaks.
  let combined: string;
  if (avgLineLen < 55 && lines.length >= 2 && lines.length <= 16) {
    combined = lines.join("\n");
  } else {
    combined = lines.join(" ").replace(/\s+/g, " ").trim();
  }

  return polishGutenbergText(combined);
}

function polishGutenbergText(text: string): string {
  return text
    // Footnote markers like [559], [iv].
    .replace(/\[(?:\d+|[ivxlcdm]+)\]/gi, "")
    // Editorial inserts.
    .replace(/\[(Illustration|Footnote|Sidenote|Transcriber|Editor)[^\]]*\]/gi, "")
    // Gutenberg italics underscores — strip the markers.
    .replace(/_([^_\n]+?)_/g, "$1")
    // Collapse the resulting whitespace.
    .replace(/[ \t]+/g, " ")
    .replace(/ +\n/g, "\n")
    .replace(/\n +/g, "\n")
    .trim();
}

function isPassageWorthy(
  text: string,
  minChars: number,
  maxChars: number,
  form: PassageOptions["form"],
  preferMultiSentence: boolean
): boolean {
  if (!text) return false;
  if (text.length < minChars || text.length > maxChars) return false;

  // Reject all-uppercase blocks (chapter headers).
  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length > 0) {
    const upper = (text.match(/[A-Z]/g) || []).length;
    if (upper / letters.length > 0.7) return false;
  }

  // Reject obvious structural markers.
  if (
    /^(CHAPTER|CHAP\.?|PART|BOOK|VOLUME|CANTO|ACT|SCENE|SECTION|ARTICLE|QUESTION|PROPOSITION|DEMONSTRATION|COROLLARY|LEMMA|SCHOLIUM|AXIOM|DEFINITION|POSTULATE|TREATISE|APPENDIX|PREFACE|INTRODUCTION|TABLE OF CONTENTS|CONTENTS|FOOTNOTES?|NOTES|BIBLIOGRAPHY|INDEX)\b/i.test(
      text
    )
  ) {
    return false;
  }

  // Reject mostly-numeric blocks (TOCs, indexes).
  if (/^[IVXLCDM\d.\s,;:-]+$/.test(text)) return false;

  // Reject editorial inserts that survived.
  if (/^\[/.test(text) && /\]\s*$/.test(text)) return false;
  if (/transcriber'?s? note/i.test(text)) return false;
  if (/^\s*\*\s*\*\s*\*/.test(text)) return false;
  if (/produced by/i.test(text) && text.length < 400) return false;

  // Reject asterisk-heavy blocks (Gutenberg horizontal rules etc).
  if ((text.match(/[*]/g) || []).length / text.length > 0.06) return false;

  // For prose / treatise, want sentence-ending punctuation.
  if (form !== "aphorism") {
    if (!/[.!?]/.test(text)) return false;
    if (preferMultiSentence) {
      const sentenceCount = (text.match(/[.!?]+\s+[A-Z"']/g) || []).length;
      if (sentenceCount < 1 && text.length < 380) return false;
    }
  }

  // Reject digit-dense blocks (tables, statistical asides).
  const digits = (text.match(/\d/g) || []).length;
  if (digits / text.length > 0.15) return false;

  return true;
}

export async function fetchPassageForThinker(
  gutenbergIds: number[],
  form: PassageOptions["form"]
): Promise<{ passage: string; bookId: number } | null> {
  const shuffled = [...gutenbergIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  for (const id of shuffled) {
    try {
      const raw = await fetchBookText(id);
      const body = stripGutenbergFraming(raw);
      const result = extractPassage(body, { form });
      if (result) {
        return { passage: result.text, bookId: id };
      }
    } catch (err) {
      console.error(`fetchPassageForThinker: book ${id} failed`, err);
    }
  }

  return null;
}

interface GutendexBook {
  id: number;
  title: string;
  authors: { name: string; birth_year: number | null; death_year: number | null }[];
}

const metaCache = new Map<number, GutendexBook>();

export async function fetchBookMeta(id: number): Promise<GutendexBook | null> {
  const cached = metaCache.get(id);
  if (cached) return cached;
  try {
    const res = await fetch(`https://gutendex.com/books/${id}/`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as GutendexBook;
    metaCache.set(id, data);
    return data;
  } catch {
    return null;
  }
}
