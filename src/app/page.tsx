"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProgress,
  saveProgress,
  hasQuizzedToday,
  type UserProgress,
  type QuizMode,
} from "@/lib/storage";
import { THINKERS, SCHOOLS, getSchoolById } from "@/lib/thinkers";
import ProgressRing from "@/components/ProgressRing";

export default function HomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<QuizMode>("passage");

  useEffect(() => {
    const p = getProgress();
    setProgress(p);
    setMode(p.preferredMode);
    setMounted(true);
  }, []);

  function switchMode(next: QuizMode) {
    setMode(next);
    if (progress) {
      const updated = { ...progress, preferredMode: next };
      saveProgress(updated);
      setProgress(updated);
    }
  }

  function startQuiz() {
    router.push(`/quiz?mode=${mode}`);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-vellum flex items-center justify-center">
        <div className="w-16 h-20 shimmer rounded" />
      </div>
    );
  }

  const quizzedToday = progress ? hasQuizzedToday(progress) : false;
  const totalThinkers = THINKERS.length;
  const seenThinkers = progress
    ? new Set(
        progress.quizHistory.flatMap((q) => q.attempts.map((a) => a.thinkerId))
      ).size
    : 0;
  const totalQuizzes = progress?.totalQuizzes || 0;

  const totalAttempts = progress
    ? progress.quizHistory.reduce((sum, q) => sum + q.attempts.length, 0)
    : 0;
  const totalCorrectThinker = progress
    ? progress.quizHistory.reduce((sum, q) => sum + q.thinkerCorrect, 0)
    : 0;
  const totalCorrectSchool = progress
    ? progress.quizHistory.reduce((sum, q) => sum + q.schoolCorrect, 0)
    : 0;
  const overallAccuracy =
    totalAttempts > 0
      ? Math.round(
          ((totalCorrectThinker + totalCorrectSchool) / (totalAttempts * 2)) *
            100
        )
      : 0;

  const lastQuiz =
    progress && progress.quizHistory.length > 0
      ? progress.quizHistory[progress.quizHistory.length - 1]
      : null;

  const schoolStats: Record<string, { correct: number; total: number }> = {};
  if (progress) {
    for (const quiz of progress.quizHistory) {
      for (const attempt of quiz.attempts) {
        const thinker = THINKERS.find((t) => t.id === attempt.thinkerId);
        if (!thinker) continue;
        if (!schoolStats[thinker.school]) {
          schoolStats[thinker.school] = { correct: 0, total: 0 };
        }
        schoolStats[thinker.school].total++;
        if (attempt.schoolCorrect) schoolStats[thinker.school].correct++;
      }
    }
  }

  const schoolEntries = Object.entries(schoolStats)
    .map(([id, stats]) => ({
      school: getSchoolById(id),
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      total: stats.total,
    }))
    .filter((e) => e.school)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="min-h-screen bg-vellum">
      {/* Hero */}
      <header className="relative overflow-hidden bg-spine text-vellum">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(246,241,232,0.4) 4px, rgba(246,241,232,0.4) 5px)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-rubric" />
            <span className="text-rubric text-xs uppercase tracking-[0.2em] font-medium">
              Daily Philosophy Quiz
            </span>
          </div>
          <h1
            className="text-5xl sm:text-6xl mb-3 text-vellum"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
          >
            Sophia
          </h1>
          <p className="text-vellum/70 max-w-md text-base leading-relaxed">
            Learn the canon of Western philosophy, one thinker at a time. From
            Heraclitus to Wittgenstein — twenty schools, the great ideas in
            plain language, the actual passages on the page.
          </p>

          {progress && progress.streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
              <span className="streak-flame">&#128293;</span>
              <span className="text-sm text-vellum/90 font-medium">
                {progress.streak} day streak
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Mode toggle */}
        <div className="flex flex-col items-center gap-3">
          <div className="mode-toggle">
            <button
              className={`mode-toggle-option ${mode === "passage" ? "active" : ""}`}
              onClick={() => switchMode("passage")}
            >
              Passage mode
            </button>
            <button
              className={`mode-toggle-option ${mode === "takeaway" ? "active" : ""}`}
              onClick={() => switchMode("takeaway")}
            >
              Takeaway mode
            </button>
          </div>
          <p className="text-xs text-ink-muted text-center max-w-md">
            {mode === "passage"
              ? "Read a passage from the original work. Identify the thinker and their school."
              : "Read a key idea in plain language. Identify the thinker and their school."}
          </p>
        </div>

        {/* Daily quiz card */}
        <div
          className="library-card p-6 cursor-pointer group"
          onClick={startQuiz}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {quizzedToday && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-correct-light text-correct font-medium">
                    Completed today
                  </span>
                )}
              </div>
              <h2 className="text-2xl mb-1 group-hover:text-rubric-dark transition-colors">
                {quizzedToday ? "Practice Again" : "Today's Quiz"}
              </h2>
              <p className="text-ink-muted text-sm">
                10 {mode === "passage" ? "passages" : "ideas"} &middot; ~6 minutes &middot; Thinker + School
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center group-hover:bg-spine transition-colors flex-shrink-0">
              <svg
                className="w-6 h-6 text-vellum"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>

        {totalQuizzes > 0 && (
          <div>
            <h2 className="text-xl mb-4">Your progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="library-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">{totalQuizzes}</p>
                <p className="text-xs text-ink-muted mt-1">Quizzes taken</p>
              </div>
              <div className="library-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">
                  {seenThinkers}/{totalThinkers}
                </p>
                <p className="text-xs text-ink-muted mt-1">Thinkers seen</p>
              </div>
              <div className="library-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">
                  {overallAccuracy}%
                </p>
                <p className="text-xs text-ink-muted mt-1">Accuracy</p>
              </div>
              <div className="library-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">
                  {(progress?.seenPassages.length || 0) +
                    (progress?.seenTakeaways.length || 0)}
                </p>
                <p className="text-xs text-ink-muted mt-1">Items studied</p>
              </div>
            </div>
          </div>
        )}

        {lastQuiz && (
          <div>
            <h2 className="text-xl mb-4">Last quiz</h2>
            <div className="library-card p-5">
              <div className="flex items-center gap-6">
                <ProgressRing
                  progress={Math.round(
                    ((lastQuiz.thinkerCorrect + lastQuiz.schoolCorrect) /
                      (lastQuiz.totalQuestions * 2)) *
                      100
                  )}
                  size={80}
                  strokeWidth={6}
                />
                <div className="flex-1">
                  <p className="text-sm text-ink-light">
                    <strong className="text-ink">
                      {lastQuiz.thinkerCorrect}/{lastQuiz.totalQuestions}
                    </strong>{" "}
                    thinkers correct
                  </p>
                  <p className="text-sm text-ink-light">
                    <strong className="text-ink">
                      {lastQuiz.schoolCorrect}/{lastQuiz.totalQuestions}
                    </strong>{" "}
                    schools correct
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    {lastQuiz.date} &middot; {lastQuiz.mode} mode
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {schoolEntries.length > 0 && (
          <div>
            <h2 className="text-xl mb-4">School mastery</h2>
            <div className="library-card p-4">
              <div className="space-y-3">
                {schoolEntries.map((entry) => (
                  <div key={entry.school!.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Link
                          href={`/school/${entry.school!.id}`}
                          className="text-sm font-medium truncate hover:text-rubric-dark transition-colors"
                        >
                          {entry.school!.name}
                        </Link>
                        <span className="text-xs text-ink-muted ml-2 flex-shrink-0">
                          {entry.accuracy}% ({entry.total} seen)
                        </span>
                      </div>
                      <div className="h-1.5 bg-vellum-dark rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${entry.accuracy}%`,
                            backgroundColor:
                              entry.accuracy >= 70
                                ? "#2f6b3e"
                                : entry.accuracy >= 40
                                  ? "#8c2f24"
                                  : "#b13b29",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl mb-4">
            {totalQuizzes === 0 ? "What you'll learn" : "Browse schools"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SCHOOLS.map((s) => (
              <Link
                key={s.id}
                href={`/school/${s.id}`}
                className="library-card p-3 group block"
              >
                <p className="text-sm font-medium mb-0.5 group-hover:text-rubric-dark transition-colors">
                  {s.name}
                </p>
                <p className="text-xs text-ink-muted">{s.period}</p>
              </Link>
            ))}
          </div>
        </div>

        <footer className="text-center py-8 border-t border-vellum-dark">
          <p className="text-xs text-ink-muted">
            Passages courtesy of Project Gutenberg &middot; Key ideas paraphrased for clarity.
          </p>
          <p className="text-xs text-ink-muted mt-1">
            {`${totalThinkers} thinkers · ${SCHOOLS.length} schools · Heraclitus to Wittgenstein`}
          </p>
        </footer>
      </main>
    </div>
  );
}
