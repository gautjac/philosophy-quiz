// Local storage wrapper for quiz progress and spaced repetition.

export type QuizMode = "passage" | "takeaway";

export interface PassageRecord {
  // Stable id we use to dedupe what the user has already seen.
  // Format: "{thinkerId}-{bookId}-{hash8}".
  id: string;
  thinkerId: string;
  thinkerName: string;
  passage: string;
  bookId: number;
  bookTitle: string | null;
  gutenbergUrl: string;
}

// A single prompt used in takeaway-mode. The id pins it for dedupe.
export interface TakeawayRecord {
  id: string; // "{thinkerId}-takeaway-{index}"
  thinkerId: string;
  thinkerName: string;
  prompt: string;
}

export interface QuizAttempt {
  date: string;
  mode: QuizMode;
  itemId: string; // passage id or takeaway id
  thinkerId: string;
  thinkerCorrect: boolean;
  schoolCorrect: boolean;
}

export interface DailyQuizResult {
  date: string;
  mode: QuizMode;
  totalQuestions: number;
  thinkerCorrect: number;
  schoolCorrect: number;
  attempts: QuizAttempt[];
}

export interface ThinkerWeight {
  thinkerId: string;
  weight: number;
  timesShown: number;
  timesThinkerCorrect: number;
  timesSchoolCorrect: number;
  lastShown: string | null;
}

export interface UserProgress {
  streak: number;
  lastQuizDate: string | null;
  totalQuizzes: number;
  preferredMode: QuizMode;
  thinkerWeights: Record<string, ThinkerWeight>;
  quizHistory: DailyQuizResult[];
  seenPassages: string[];
  seenTakeaways: string[];
}

const STORAGE_KEY = "philosophy-quiz-progress";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getProgress(): UserProgress {
  if (!isBrowser()) return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    // Forward-fill any newly added fields so old payloads keep working.
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function defaultProgress(): UserProgress {
  return {
    streak: 0,
    lastQuizDate: null,
    totalQuizzes: 0,
    preferredMode: "passage",
    thinkerWeights: {},
    quizHistory: [],
    seenPassages: [],
    seenTakeaways: [],
  };
}

export function getThinkerWeight(
  progress: UserProgress,
  thinkerId: string
): ThinkerWeight {
  return (
    progress.thinkerWeights[thinkerId] || {
      thinkerId,
      weight: 5,
      timesShown: 0,
      timesThinkerCorrect: 0,
      timesSchoolCorrect: 0,
      lastShown: null,
    }
  );
}

export function updateWeightAfterAttempt(
  progress: UserProgress,
  thinkerId: string,
  thinkerCorrect: boolean,
  schoolCorrect: boolean
): void {
  const w = getThinkerWeight(progress, thinkerId);
  w.timesShown++;
  if (thinkerCorrect) w.timesThinkerCorrect++;
  if (schoolCorrect) w.timesSchoolCorrect++;
  w.lastShown = new Date().toISOString();

  if (thinkerCorrect && schoolCorrect) {
    w.weight = Math.max(1, w.weight - 1);
  } else if (!thinkerCorrect && !schoolCorrect) {
    w.weight = Math.min(10, w.weight + 2);
  } else {
    w.weight = Math.min(10, w.weight + 1);
  }

  progress.thinkerWeights[thinkerId] = w;
}

export function updateStreak(progress: UserProgress): void {
  const today = new Date().toISOString().split("T")[0];
  if (progress.lastQuizDate === today) return;

  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];
  if (progress.lastQuizDate === yesterday) {
    progress.streak++;
  } else {
    progress.streak = 1;
  }
  progress.lastQuizDate = today;
  progress.totalQuizzes++;
}

export function hasQuizzedToday(progress: UserProgress): boolean {
  const today = new Date().toISOString().split("T")[0];
  return progress.lastQuizDate === today;
}

// Cheap hash so the same passage ID is stable across sessions.
export function hashPassage(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36).padStart(8, "0").slice(0, 8);
}
