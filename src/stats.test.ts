import test from "node:test";
import assert from "node:assert/strict";

import { computeStats } from "./stats";

test("counts words, lines, and characters for multi-line text", () => {
  const stats = computeStats("hello world\nsecond line here\n");
  assert.equal(stats.lines, 2);
  assert.equal(stats.words, 5);
  assert.equal(stats.chars, 29);
});

test("treats an empty string as zero everything", () => {
  assert.deepEqual(computeStats(""), { lines: 0, words: 0, chars: 0 });
});

test("collapses runs of whitespace when counting words", () => {
  assert.equal(computeStats("one    two\tthree").words, 3);
});

test("counts a final line without a trailing newline", () => {
  const stats = computeStats("first\nlast");
  assert.equal(stats.lines, 2);
});

test("rejects missing input", () => {
  assert.throws(() => computeStats(undefined as unknown as string), TypeError);
});
