import test from "node:test";
import assert from "node:assert/strict";
import { PassThrough } from "node:stream";

import { Logger } from "./logger";

test("logger at info level emits info but filters debug", () => {
  const buffer: string[] = [];
  const pipe = new PassThrough();
  pipe.on("data", (chunk: Buffer) => buffer.push(chunk.toString()));

  const logger = new Logger({ level: "info", out: pipe as unknown as NodeJS.WriteStream });
  logger.debug("hidden");
  logger.info("hello", { key: "value" });

  assert.equal(buffer.length, 1);
  const entry = JSON.parse(buffer[0]) as { level: string; msg: string; key: string };
  assert.equal(entry.level, "info");
  assert.equal(entry.msg, "hello");
  assert.equal(entry.key, "value");
});

test("warn and info both pass an info-level filter, in order", () => {
  const buffer: string[] = [];
  const pipe = new PassThrough();
  pipe.on("data", (chunk: Buffer) => buffer.push(chunk.toString()));

  const logger = new Logger({ level: "info", out: pipe as unknown as NodeJS.WriteStream });
  logger.warn("caution");
  logger.info("fine");

  const levels = buffer.map((line) => (JSON.parse(line) as { level: string }).level);
  assert.deepEqual(levels, ["warn", "info"]);
});

test("error is written to stderr as one JSON line", () => {
  const buffer: string[] = [];
  const original = process.stderr.write.bind(process.stderr);
  process.stderr.write = ((chunk: string) => {
    buffer.push(chunk);
    return true;
  }) as typeof process.stderr.write;

  try {
    const logger = new Logger({ level: "debug" });
    logger.error("boom");
  } finally {
    process.stderr.write = original;
  }

  assert.equal(buffer.length, 1);
  const entry = JSON.parse(buffer[0]) as { level: string; msg: string };
  assert.equal(entry.level, "error");
  assert.equal(entry.msg, "boom");
});
