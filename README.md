# dev-utility-tool

A lightweight Node.js CLI that computes quick text statistics — lines, words, and characters — on a file or piped stdin. Useful as a stopgap for `wc`-style checks on Windows shells or as a library for small TypeScript scripts.

## Features

- **Pure core logic** (`src/stats.ts`) with no I/O, easy to reuse
- **CLI with two input modes**: pass a file path, or pipe stdin
- **JSON output** that is easy to consume in scripts
- **Zero runtime dependencies** — TypeScript compile-time only

## Installation

Requires Node.js 18+.

```bash
# From a clone of this repository
npm install
npm run build
npm link            # optional: registers the `devstats` command
```

## Usage

```bash
# On a file
devstats notes.txt

# On piped input
type notes.md | devstats

# Output
{
  "lines": 42,
  "words": 380,
  "chars": 2117
}
```

Non-zero exit code on missing files or missing input, so it composes cleanly in shell pipelines.

## Development

```bash
npm install     # install devDependencies (TypeScript)
npm run build   # compile src/ -> dist/
npm run test    # build and run unit tests (node:test)
npm run lint    # type-check without emitting
```

## License

[MIT](LICENSE)
