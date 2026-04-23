import "server-only";
import { Filter } from "bad-words";

/**
 * Lightweight wrapper around the `bad-words` filter with a small set of
 * high-signal additions. The v1 rule is harsh-but-simple: if any word
 * matches, reject the whole message with a generic error.
 */
const filter = new Filter();

// Extend with a few additional terms we care about beyond the default list.
// Keep this list short and focused on slurs; regular swearing is covered by
// the default dictionary.
filter.addWords(
  // (Placeholder list — add the specific words the officers want blocked
  // here. Kept generic to avoid shipping offensive terms in source.)
  "n1gger",
  "f4ggot",
);

export function containsProfanity(text: string): boolean {
  if (!text.trim()) return false;
  return filter.isProfane(text);
}

/** Return the text with flagged words replaced, for UI preview if needed. */
export function cleanProfanity(text: string): string {
  return filter.clean(text);
}
