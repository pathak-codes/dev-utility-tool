/**
 * Core text statistics logic.
 *
 * Pure functions with no I/O, so they can be tested and reused
 * from scripts or other modules.
 */

export interface TextStats {
  /** Number of lines (counting the last line even without a trailing newline). */
  lines: number;
  /** Number of words, split on runs of whitespace. */
  words: number;
  /** Total number of characters, including whitespace. */
  chars: number;
}

/**
 * Compute basic statistics for a block of text.
 *
 * @param text - The text to analyze. May be empty, but must not be null/undefined.
 * @returns Line, word, and character counts.
 */
export function computeStats(text: string): TextStats {
  if (text === undefined || text === null) {
    throw new TypeError("computeStats expects a string");
  }

  const trimmed = text.trim();
  // Normalize: a trailing line terminator does not create an extra line.
  const segments = text.split(/\r\n|\r|\n/);
  const lines =
    text.length === 0 ? 0 : segments.length - (/(?:\r\n|\r|\n)$/.test(text) ? 1 : 0);
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const chars = text.length;

  return { lines, words, chars };
}
