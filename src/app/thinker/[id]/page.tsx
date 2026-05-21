"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getThinkerById, getSchoolForThinker } from "@/lib/thinkers";

export default function ThinkerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [thinkerId, setThinkerId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setThinkerId(p.id));
  }, [params]);

  const thinker = thinkerId ? getThinkerById(thinkerId) : null;
  const school = thinker ? getSchoolForThinker(thinker) : null;

  if (!thinkerId) {
    return (
      <div className="min-h-screen bg-vellum flex items-center justify-center">
        <div className="w-16 h-20 shimmer rounded" />
      </div>
    );
  }

  if (!thinker) {
    return (
      <div className="min-h-screen bg-vellum">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">Thinker not found</h1>
          <Link href="/" className="text-rubric-dark hover:underline">
            &larr; Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vellum">
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
        <div className="relative max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <Link
            href={school ? `/school/${school.id}` : "/"}
            className="text-vellum/60 hover:text-vellum text-sm transition-colors mb-4 inline-block"
          >
            &larr; {school ? school.name : "Home"}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-rubric" />
            <span className="text-rubric text-xs uppercase tracking-[0.2em] font-medium">
              {thinker.nationality} &middot; {formatYear(thinker.birthYear)}
              {thinker.deathYear ? `–${formatYear(thinker.deathYear)}` : "–present"}
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl text-vellum mb-3"
            style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}
          >
            {thinker.name}
          </h1>
          <p className="text-vellum/70 max-w-lg text-base leading-relaxed">
            {thinker.bio}
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="library-card p-5 sm:p-6">
          <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-3">
            Key takeaways
          </p>
          <ul className="takeaways-list">
            {thinker.keyTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {thinker.keyWorks.length > 0 && (
          <div className="library-card p-5 sm:p-6">
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-3">
              Key works
            </p>
            <ul className="space-y-1.5">
              {thinker.keyWorks.map((w, i) => (
                <li key={i} className="text-sm text-ink-light italic">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {school && (
          <div className="library-card p-5 sm:p-6">
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
              School
            </p>
            <Link
              href={`/school/${school.id}`}
              className="text-lg font-medium hover:text-rubric-dark transition-colors block mb-1"
            >
              {school.name}
            </Link>
            <p className="text-xs text-ink-muted mb-3">{school.period}</p>
            <p className="text-sm text-ink-light leading-relaxed">
              {school.description}
            </p>
          </div>
        )}

        <div className="pt-4 pb-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-ink text-vellum rounded-lg font-medium hover:bg-spine transition-colors cursor-pointer"
          >
            &larr; Back to home
          </button>
        </div>
      </main>
    </div>
  );
}

function formatYear(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year}`;
}
