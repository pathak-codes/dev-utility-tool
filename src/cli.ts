#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { computeStats } from "./stats";

function readInput(args: string[]): string {
  const fileArg = args[0];

  if (fileArg) {
    if (!existsSync(fileArg)) {
      console.error(`error: file not found: ${fileArg}`);
      process.exitCode = 1;
      return "";
    }
    return readFileSync(fileArg, "utf8");
  }

  // No file argument: read piped stdin.
  try {
    return readFileSync(0, "utf8");
  } catch {
    console.error("error: no input file given and nothing piped on stdin");
    process.exitCode = 1;
    return "";
  }
}

const input = readInput(process.argv.slice(2));

if (input.length > 0 || process.argv.length > 2) {
  const stats = computeStats(input);
  console.log(JSON.stringify(stats, null, 2));
}
