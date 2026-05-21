import {
  THINKERS,
  SCHOOLS,
  type Thinker,
  getSchoolById,
} from "./thinkers";
import {
  type PassageRecord,
  type TakeawayRecord,
  type QuizMode,
  type UserProgress,
  getThinkerWeight,
  hashPassage,
} from "./storage";

export interface QuizQuestion {
  mode: QuizMode;
  // Exactly one of these is populated based on mode.
  passage?: PassageRecord;
  takeaway?: TakeawayRecord;
  thinkerChoices: Thinker[];
  schoolChoices: { id: string; name: string }[];
  correctThinker: Thinker;
  correctSchool: { id: string; name: string };
}

export function selectThinkersForQuiz(
  progress: UserProgress,
  mode: QuizMode,
  count = 10
): Thinker[] {
  // Passage mode requires the thinker to have at least one PD work; takeaway
  // mode requires at least one prompt. (Every thinker should have prompts,
  // but be defensive.)
  const eligible = THINKERS.filter((t) =>
    mode === "passage" ? t.gutenbergIds.length > 0 : t.takeawayPrompts.length > 0
  );

  const weighted = eligible.map((thinker) => ({
    thinker,
    weight: getThinkerWeight(progress, thinker.id).weight,
  }));

  const selected: Thinker[] = [];
  const pool = [...weighted];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let j = 0; j < pool.length; j++) {
      random -= pool[j].weight;
      if (random <= 0) {
        selected.push(pool[j].thinker);
        pool.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}

// ----- Passage mode -----

interface PassageApiResponse {
  thinkerId: string;
  thinkerName: string;
  passage: string;
  form: Thinker["form"];
  bookId: number;
  bookTitle: string | null;
  gutenbergUrl: string;
}

async function fetchOnePassage(
  thinker: Thinker
): Promise<PassageRecord | null> {
  try {
    const res = await fetch(`/api/passage?thinker=${encodeURIComponent(thinker.id)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as PassageApiResponse;
    return {
      id: `${data.thinkerId}-${data.bookId}-${hashPassage(data.passage)}`,
      thinkerId: data.thinkerId,
      thinkerName: data.thinkerName,
      passage: data.passage,
      bookId: data.bookId,
      bookTitle: data.bookTitle,
      gutenbergUrl: data.gutenbergUrl,
    };
  } catch (err) {
    console.error(`Passage fetch failed for ${thinker.name}:`, err);
    return null;
  }
}

async function fetchBatch<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

export async function fetchPassagesForThinkers(
  thinkers: Thinker[]
): Promise<Map<string, PassageRecord>> {
  const results = new Map<string, PassageRecord>();
  const records = await fetchBatch(thinkers, 4, fetchOnePassage);
  for (let i = 0; i < thinkers.length; i++) {
    const r = records[i];
    if (r) results.set(thinkers[i].id, r);
  }
  return results;
}

// ----- Takeaway mode -----

export function buildTakeawayForThinker(
  thinker: Thinker,
  seenIds: Set<string>
): TakeawayRecord | null {
  if (thinker.takeawayPrompts.length === 0) return null;

  // Pick the lowest-index unseen prompt; fall back to a random one if all seen.
  const candidates = thinker.takeawayPrompts
    .map((prompt, idx) => ({
      id: `${thinker.id}-takeaway-${idx}`,
      prompt,
    }))
    .filter((c) => !seenIds.has(c.id));

  const chosen =
    candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : {
          id: `${thinker.id}-takeaway-${Math.floor(
            Math.random() * thinker.takeawayPrompts.length
          )}`,
          prompt:
            thinker.takeawayPrompts[
              Math.floor(Math.random() * thinker.takeawayPrompts.length)
            ],
        };

  return {
    id: chosen.id,
    thinkerId: thinker.id,
    thinkerName: thinker.name,
    prompt: chosen.prompt,
  };
}

// ----- Question generation -----

export function generatePassageQuestions(
  passageMap: Map<string, PassageRecord>,
  thinkers: Thinker[],
  count: number,
  seenPassageIds: string[] = []
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedThinkers = thinkers.filter((t) => passageMap.has(t.id));
  const seenSet = new Set(seenPassageIds);

  const preferred = usedThinkers.filter(
    (t) => !seenSet.has(passageMap.get(t.id)!.id)
  );
  const fallback = usedThinkers.filter((t) =>
    seenSet.has(passageMap.get(t.id)!.id)
  );
  const ordered = [...preferred, ...fallback];

  for (const thinker of ordered) {
    if (questions.length >= count) break;

    const passage = passageMap.get(thinker.id)!;
    const school = getSchoolById(thinker.school);
    if (!school) continue;

    const wrongThinkers = generateWrongThinkerChoices(thinker, 3);
    const thinkerChoices = shuffle([thinker, ...wrongThinkers]);

    const wrongSchools = generateWrongSchoolChoices(school.id, 3);
    const schoolChoices = shuffle([
      { id: school.id, name: school.name },
      ...wrongSchools,
    ]);

    questions.push({
      mode: "passage",
      passage,
      thinkerChoices,
      schoolChoices,
      correctThinker: thinker,
      correctSchool: { id: school.id, name: school.name },
    });
  }

  return shuffle(questions).slice(0, count);
}

export function generateTakeawayQuestions(
  thinkers: Thinker[],
  count: number,
  seenTakeawayIds: string[] = []
): QuizQuestion[] {
  const seenSet = new Set(seenTakeawayIds);
  const questions: QuizQuestion[] = [];

  for (const thinker of thinkers) {
    if (questions.length >= count) break;
    const takeaway = buildTakeawayForThinker(thinker, seenSet);
    if (!takeaway) continue;
    const school = getSchoolById(thinker.school);
    if (!school) continue;

    const wrongThinkers = generateWrongThinkerChoices(thinker, 3);
    const thinkerChoices = shuffle([thinker, ...wrongThinkers]);

    const wrongSchools = generateWrongSchoolChoices(school.id, 3);
    const schoolChoices = shuffle([
      { id: school.id, name: school.name },
      ...wrongSchools,
    ]);

    questions.push({
      mode: "takeaway",
      takeaway,
      thinkerChoices,
      schoolChoices,
      correctThinker: thinker,
      correctSchool: { id: school.id, name: school.name },
    });
  }

  return shuffle(questions).slice(0, count);
}

function generateWrongThinkerChoices(correct: Thinker, count: number): Thinker[] {
  const candidates = THINKERS.filter((t) => t.id !== correct.id);

  const sameEra = candidates.filter((t) => t.era === correct.era);
  const sameSchool = candidates.filter((t) => t.school === correct.school);
  const sameForm = candidates.filter((t) => t.form === correct.form);

  // Plausible distractors: same school > same era > same form.
  const preferred = [
    ...new Set([...sameSchool, ...sameEra, ...sameForm]),
  ];
  const others = candidates.filter((t) => !preferred.includes(t));

  const pool = preferred.length >= count ? preferred : [...preferred, ...others];
  return shuffle(pool).slice(0, count);
}

function generateWrongSchoolChoices(
  correctSchoolId: string,
  count: number
): { id: string; name: string }[] {
  const wrong = SCHOOLS.filter((s) => s.id !== correctSchoolId);
  return shuffle(wrong)
    .slice(0, count)
    .map((s) => ({ id: s.id, name: s.name }));
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
