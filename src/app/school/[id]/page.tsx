"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSchoolById } from "@/lib/schools";
import { getThinkersBySchool } from "@/lib/thinkers";

export default function SchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSchoolId(p.id));
  }, [params]);

  const school = schoolId ? getSchoolById(schoolId) : null;
  const thinkers = schoolId ? getThinkersBySchool(schoolId) : [];

  if (!schoolId) {
    return (
      <div className="min-h-screen bg-vellum flex items-center justify-center">
        <div className="w-16 h-20 shimmer rounded" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-vellum">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">School not found</h1>
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
            href="/"
            className="text-vellum/60 hover:text-vellum text-sm transition-colors mb-4 inline-block"
          >
            &larr; Back to home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-rubric" />
            <span className="text-rubric text-xs uppercase tracking-[0.2em] font-medium">
              {school.period}
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl text-vellum mb-3"
            style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}
          >
            {school.name}
          </h1>
          <p className="text-vellum/70 max-w-lg text-base leading-relaxed">
            {school.description}
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        <div className="library-card p-5 sm:p-6">
          <p className="text-ink-light leading-relaxed text-[15px]">
            {school.longDescription}
          </p>
        </div>

        <div>
          <h2 className="text-xl mb-4">
            {thinkers.length === 1 ? "Featured thinker" : "Key thinkers"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {thinkers.map((t) => (
              <Link
                key={t.id}
                href={`/thinker/${t.id}`}
                className="library-card p-4 block group"
              >
                <h3 className="font-medium mb-0.5 group-hover:text-rubric-dark transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-rubric-dark mb-1.5">
                  {t.nationality}, {formatYear(t.birthYear)}
                  {t.deathYear ? `–${formatYear(t.deathYear)}` : "–present"} &middot; {t.form}
                </p>
                <p className="text-sm text-ink-light leading-relaxed">
                  {t.bio}
                </p>
              </Link>
            ))}
          </div>
        </div>

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
