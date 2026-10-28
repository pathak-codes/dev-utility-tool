/**
 * Minimal structured logger.
 *
 * Emits one JSON line per event on stdout (and stderr for errors), so
 * output is stable regardless of log level filtering — a convention that
 * plays well with log shippers and CI logs alike.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogOptions {
  /** Lowest level that still gets emitted. Defaults to "info". */
  level?: LogLevel;
  /** Stream to write to. Defaults to process.stdout/stderr. */
  out?: NodeJS.WriteStream;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export class Logger {
  private readonly minLevel: number;
  private readonly out: NodeJS.WriteStream;

  constructor(options: LogOptions = {}) {
    this.minLevel = LEVEL_ORDER[options.level ?? "info"];
    this.out = options.out ?? process.stdout;
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (LEVEL_ORDER[level] < this.minLevel) {
      return;
    }

    const entry = {
      time: new Date().toISOString(),
      level,
      msg: message,
      ...meta,
    };

    if (level === "error") {
      // Errors go to stderr, everything else uses the configured stream.
      process.stderr.write(`${JSON.stringify(entry)}\n`);
    } else {
      this.out.write(`${JSON.stringify(entry)}\n`);
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log("error", message, meta);
  }
}
