"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  selectThinkersForQuiz,
  fetchPassagesForThinkers,
  generatePassageQuestions,
  generateTakeawayQuestions,
  type QuizQuestion,
} from "@/lib/quiz-engine";
import {
  getProgress,
  saveProgress,
  updateWeightAfterAttempt,
  updateStreak,
  type DailyQuizResult,
  type QuizAttempt,
  type QuizMode,
} from "@/lib/storage";
import QuizResults from "@/components/QuizResults";
import { getSchoolById, type Thinker } from "@/lib/thinkers";

type PageState = "loading" | "playing" | "results" | "error";
type Phase = "thinker" | "school" | "reveal";

interface AttemptResult {
  question: QuizQuestion;
  thinkerCorrect: boolean;
  schoolCorrect: boolean;
}

const QUIZ_SIZE = 10;

function QuizPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: QuizMode =
    searchParams.get("mode") === "takeaway" ? "takeaway" : "passage";

  const [pageState, setPageState] = useState<PageState>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AttemptResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Pulling volumes from the stacks..."
  );

  const [phase, setPhase] = useState<Phase>("thinker");
  const [selectedThinker, setSelectedThinker] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [thinkerCorrect, setThinkerCorrect] = useState(false);
  const [schoolCorrect, setSchoolCorrect] = useState(false);

  const question = questions[currentIndex] ?? null;
  const school = question
    ? getSchoolById(question.correctThinker.school)
    : null;

  const loadQuiz = useCallback(async () => {
    setPageState("loading");
    setCurrentIndex(0);
    setResults([]);
    setPhase("thinker");
    setSelectedThinker(null);
    setSelectedSchool(null);
    setThinkerCorrect(false);
    setSchoolCorrect(false);

    const messages =
      mode === "passage"
        ? [
            "Pulling volumes from the stacks...",
            "Cutting the pages...",
            "Letting the print dry...",
            "Choosing today's passages...",
          ]
        : [
            "Distilling the great ideas...",
            "Sharpening the maxims...",
            "Polishing the aphorisms...",
            "Choosing today's claims...",
          ];
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2000);

    try {
      const progress = getProgress();
      const thinkers = selectThinkersForQuiz(progress, mode, QUIZ_SIZE + 5);

      let quizQuestions: QuizQuestion[];
      if (mode === "passage") {
        const passageMap = await fetchPassagesForThinkers(thinkers);
        quizQuestions = generatePassageQuestions(
          passageMap,
          thinkers,
          QUIZ_SIZE,
          progress.seenPassages
        );
      } else {
        quizQuestions = generateTakeawayQuestions(
          thinkers,
          QUIZ_SIZE,
          progress.seenTakeaways
        );
      }

      if (quizQuestions.length === 0) {
        setLoadingMessage(
          mode === "passage"
            ? "Project Gutenberg seems to be napping. Try again in a moment..."
            : "Could not assemble a quiz. Try again in a moment..."
        );
        setPageState("error");
        return;
      }

      setQuestions(quizQuestions);
      setPageState("playing");
    } catch (err) {
      console.error("Failed to load quiz:", err);
      setLoadingMessage(
        mode === "passage"
          ? "Project Gutenberg seems to be napping. Try again in a moment..."
          : "Something went wrong. Try again in a moment..."
      );
      setPageState("error");
    } finally {
      clearInterval(msgInterval);
    }
  }, [mode]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  function handleThinkerChoice(thinker: Thinker) {
    if (selectedThinker || !question) return;
    const correct = thinker.id === question.correctThinker.id;
    setSelectedThinker(thinker.id);
    setThinkerCorrect(correct);
  }

  function handleSchoolChoice(schoolId: string) {
    if (selectedSchool || !question) return;
    const correct = schoolId === question.correctSchool.id;
    setSelectedSchool(schoolId);
    setSchoolCorrect(correct);
  }

  function advanceToSchool() {
    setPhase("school");
  }

  function advanceToReveal() {
    setPhase("reveal");
  }

  function advanceToNext() {
    if (!question) return;

    const progress = getProgress();
    updateWeightAfterAttempt(
      progress,
      question.correctThinker.id,
      thinkerCorrect,
      schoolCorrect
    );

    const newResult: AttemptResult = { question, thinkerCorrect, schoolCorrect };
    const newResults = [...results, newResult];
    setResults(newResults);

    if (currentIndex + 1 >= questions.length) {
      updateStreak(progress);
      setStreak(progress.streak);

      const dailyResult: DailyQuizResult = {
        date: new Date().toISOString().split("T")[0],
        mode,
        totalQuestions: questions.length,
        thinkerCorrect: newResults.filter((r) => r.thinkerCorrect).length,
        schoolCorrect: newResults.filter((r) => r.schoolCorrect).length,
        attempts: newResults.map(
          (r): QuizAttempt => ({
            date: new Date().toISOString(),
            mode,
            itemId:
              r.question.mode === "passage"
                ? r.question.passage!.id
                : r.question.takeaway!.id,
            thinkerId: r.question.correctThinker.id,
            thinkerCorrect: r.thinkerCorrect,
            schoolCorrect: r.schoolCorrect,
          })
        ),
      };
      progress.quizHistory.push(dailyResult);

      for (const r of newResults) {
        if (r.question.mode === "passage") {
          if (!progress.seenPassages.includes(r.question.passage!.id)) {
            progress.seenPassages.push(r.question.passage!.id);
          }
        } else {
          if (!progress.seenTakeaways.includes(r.question.takeaway!.id)) {
            progress.seenTakeaways.push(r.question.takeaway!.id);
          }
        }
      }

      saveProgress(progress);
      setPageState("results");
    } else {
      setPhase("thinker");
      setSelectedThinker(null);
      setSelectedSchool(null);
      setThinkerCorrect(false);
      setSchoolCorrect(false);
      setCurrentIndex(currentIndex + 1);
    }
  }

  return (
    <div className="min-h-screen bg-vellum">
      <header className="border-b border-vellum-dark bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
          <h1
            className="text-lg tracking-tight"
            style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}
          >
            Sophia
          </h1>
          <span className="text-xs text-ink-muted uppercase tracking-wider">
            {mode}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 sm:py-8">
        {pageState === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
            <div className="loading-passage shimmer w-72 h-48 rounded" />
            <p className="text-ink-muted text-sm mt-4 italic">{loadingMessage}</p>
          </div>
        )}

        {pageState === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in text-center">
            <p className="text-ink-muted text-sm italic max-w-md">
              {loadingMessage}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-white border-2 border-vellum-dark text-ink rounded-lg font-medium hover:border-rubric transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={loadQuiz}
                className="px-6 py-2 bg-ink text-vellum rounded-lg font-medium hover:bg-spine transition-colors cursor-pointer"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {pageState === "playing" && question && (
          <div>
            {/* Progress bar */}
            <div className="mb-4 sm:mb-6 flex items-center gap-3">
              <span className="text-sm text-ink-muted font-medium">
                {currentIndex + 1} / {questions.length}
              </span>
              <div className="flex-1 h-1.5 bg-vellum-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-rubric rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* The question card — passage or takeaway */}
            <div className="mb-4 sm:mb-6">
              {question.mode === "passage" && question.passage ? (
                <>
                  <div
                    className={`passage-card max-w-2xl mx-auto ${
                      question.correctThinker.form === "aphorism" ? "aphorism" : ""
                    }`}
                  >
                    <div
                      className={
                        question.correctThinker.form === "treatise" ||
                        question.correctThinker.form === "essay"
                          ? "drop-cap"
                          : ""
                      }
                    >
                      {question.passage.passage}
                    </div>
                  </div>
                  {phase === "reveal" && (
                    <div className="mt-4 text-center max-w-2xl mx-auto">
                      {question.passage.bookTitle && (
                        <p className="text-sm text-ink-muted italic">
                          from <span className="text-ink">{question.passage.bookTitle}</span>
                        </p>
                      )}
                      <a
                        href={question.passage.gutenbergUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-ink-muted hover:text-rubric-dark underline-offset-2 hover:underline mt-0.5 inline-block"
                      >
                        Read on Project Gutenberg →
                      </a>
                    </div>
                  )}
                </>
              ) : (
                question.takeaway && (
                  <div className="takeaway-card max-w-2xl mx-auto">
                    <div>{question.takeaway.prompt}</div>
                  </div>
                )
              )}
            </div>

            {/* THINKER PHASE */}
            {phase === "thinker" && (
              <div>
                <h2 className="text-lg sm:text-xl mb-3 sm:mb-4 text-center">
                  {question.mode === "passage"
                    ? "Who wrote this passage?"
                    : "Whose idea is this?"}
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto">
                  {question.thinkerChoices.map((t) => {
                    let cls = "choice-btn";
                    if (selectedThinker) {
                      if (t.id === question.correctThinker.id) cls += " correct";
                      else if (t.id === selectedThinker) cls += " wrong";
                    }
                    return (
                      <button
                        key={t.id}
                        className={cls}
                        onClick={() => handleThinkerChoice(t)}
                        disabled={!!selectedThinker}
                      >
                        <span className="font-medium text-sm sm:text-base">
                          {t.name}
                        </span>
                        <span className="block text-[10px] sm:text-xs text-ink-muted mt-0.5">
                          {t.nationality}, {formatYear(t.birthYear)}
                          {t.deathYear ? `–${formatYear(t.deathYear)}` : "–present"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedThinker && (
                  <div className="mt-4 text-center">
                    <p
                      className={`text-sm font-medium mb-3 ${
                        thinkerCorrect ? "text-correct" : "text-wrong"
                      }`}
                    >
                      {thinkerCorrect
                        ? "Correct."
                        : `It's ${question.correctThinker.name}.`}
                    </p>
                    <button
                      onClick={advanceToSchool}
                      className="px-6 py-2 bg-ink text-vellum rounded-lg font-medium hover:bg-spine transition-colors cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SCHOOL PHASE */}
            {phase === "school" && (
              <div>
                <h2 className="text-lg sm:text-xl mb-3 text-center">
                  What school is{" "}
                  <span className="text-rubric-dark italic">
                    {question.correctThinker.name}
                  </span>{" "}
                  associated with?
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto">
                  {question.schoolChoices.map((s) => {
                    let cls = "choice-btn";
                    if (selectedSchool) {
                      if (s.id === question.correctSchool.id) cls += " correct";
                      else if (s.id === selectedSchool) cls += " wrong";
                    }
                    return (
                      <button
                        key={s.id}
                        className={cls}
                        onClick={() => handleSchoolChoice(s.id)}
                        disabled={!!selectedSchool}
                      >
                        <span className="font-medium text-sm sm:text-base">
                          {s.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedSchool && (
                  <div className="mt-4 text-center">
                    <p
                      className={`text-sm font-medium mb-3 ${
                        schoolCorrect ? "text-correct" : "text-wrong"
                      }`}
                    >
                      {schoolCorrect
                        ? "Correct."
                        : `The answer is ${question.correctSchool.name}.`}
                    </p>
                    <button
                      onClick={advanceToReveal}
                      className="px-6 py-2 bg-ink text-vellum rounded-lg font-medium hover:bg-spine transition-colors cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* REVEAL PHASE */}
            {phase === "reveal" && (
              <div className="max-w-xl mx-auto">
                <div className="flex justify-center gap-4 mb-5">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      thinkerCorrect
                        ? "bg-correct-light text-correct"
                        : "bg-wrong-light text-wrong"
                    }`}
                  >
                    Thinker: {thinkerCorrect ? "Correct" : "Incorrect"}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      schoolCorrect
                        ? "bg-correct-light text-correct"
                        : "bg-wrong-light text-wrong"
                    }`}
                  >
                    School: {schoolCorrect ? "Correct" : "Incorrect"}
                  </div>
                </div>

                <div className="library-card p-5 mb-6">
                  <h3 className="text-lg mb-1">
                    {question.correctThinker.name}
                  </h3>
                  <p className="text-sm text-rubric-dark font-medium mb-2">
                    {school?.name} · {school?.period}
                  </p>
                  <p className="text-sm text-ink-light leading-relaxed mb-4">
                    {question.correctThinker.bio}
                  </p>

                  <div className="pt-4 border-t border-vellum-dark">
                    <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
                      Key takeaways
                    </p>
                    <ul className="takeaways-list">
                      {question.correctThinker.keyTakeaways.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {school && (
                    <div className="pt-4 mt-4 border-t border-vellum-dark">
                      <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                        About {school.name}
                      </p>
                      <p className="text-sm text-ink-light leading-relaxed">
                        {school.description}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={advanceToNext}
                  className="w-full py-3.5 bg-ink text-vellum rounded-lg font-medium hover:bg-spine transition-colors cursor-pointer"
                >
                  {currentIndex + 1 === questions.length
                    ? "See Results"
                    : "Next"}
                </button>
              </div>
            )}
          </div>
        )}

        {pageState === "results" && (
          <QuizResults
            mode={mode}
            results={results}
            streak={streak}
            onPlayAgain={loadQuiz}
            onGoHome={() => router.push("/")}
          />
        )}
      </main>
    </div>
  );
}

function formatYear(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year}`;
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-vellum flex items-center justify-center">
          <div className="w-16 h-20 shimmer rounded" />
        </div>
      }
    >
      <QuizPageInner />
    </Suspense>
  );
}
