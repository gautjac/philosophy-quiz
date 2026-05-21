import { type NextRequest } from "next/server";
import { fetchPassageForThinker, fetchBookMeta } from "@/lib/gutenberg";
import { getCachedPassage } from "@/lib/passage-cache";
import { getThinkerById } from "@/lib/thinkers";

export async function GET(request: NextRequest) {
  const thinkerId = request.nextUrl.searchParams.get("thinker");
  if (!thinkerId) {
    return Response.json({ error: "Missing thinker parameter" }, { status: 400 });
  }

  const thinker = getThinkerById(thinkerId);
  if (!thinker) {
    return Response.json({ error: "Unknown thinker" }, { status: 404 });
  }

  // Fast path: pre-extracted passage shipped with the build.
  const cached = getCachedPassage(thinkerId);
  if (cached) {
    return Response.json({
      thinkerId: thinker.id,
      thinkerName: thinker.name,
      passage: cached.passage,
      form: thinker.form,
      bookId: cached.bookId,
      bookTitle: cached.bookTitle,
      gutenbergUrl: `https://www.gutenberg.org/ebooks/${cached.bookId}`,
      source: "cache",
    });
  }

  // Fallback: hit Project Gutenberg directly.
  try {
    if (thinker.gutenbergIds.length === 0) {
      return Response.json(
        { error: "This thinker has no public-domain works available for passage mode" },
        { status: 422 }
      );
    }

    const result = await fetchPassageForThinker(thinker.gutenbergIds, thinker.form);
    if (!result) {
      return Response.json(
        { error: "No suitable passage found for this thinker" },
        { status: 502 }
      );
    }

    const meta = await fetchBookMeta(result.bookId);

    return Response.json({
      thinkerId: thinker.id,
      thinkerName: thinker.name,
      passage: result.passage,
      form: thinker.form,
      bookId: result.bookId,
      bookTitle: meta?.title ?? null,
      gutenbergUrl: `https://www.gutenberg.org/ebooks/${result.bookId}`,
      source: "live",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
