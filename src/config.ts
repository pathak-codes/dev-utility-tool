/**
 * Environment configuration loader.
 *
 * Reads configuration from a plain env map and fills in safe defaults,
 * failing fast on values that violate their type. Kept independent of
 * `process.env` at the function level so it is trivially testable.
 */

export interface AppConfig {
  /** HTTP port the app binds to. */
  port: number;
  /** Minimum level the shared logger emits at. */
  logLevel: "debug" | "info" | "warn" | "error";
  /** Human-readable service name used in log lines. */
  service: string;
}

export class ConfigError extends Error {
  constructor(key: string, reason: string) {
    super(`invalid configuration for "${key}": ${reason}`);
    this.name = "ConfigError";
  }
}

const VALID_LOG_LEVELS = new Set(["debug", "info", "warn", "error"]);

function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === "") {
    return 3000;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new ConfigError("DEVSTATS_PORT", "must be an integer between 1 and 65535");
  }
  return parsed;
}

function parseLogLevel(raw: string | undefined): AppConfig["logLevel"] {
  if (raw === undefined || raw.trim() === "") {
    return "info";
  }

  const normalized = raw.trim().toLowerCase();
  if (!VALID_LOG_LEVELS.has(normalized)) {
    throw new ConfigError("DEVSTATS_LOG_LEVEL", "must be one of debug, info, warn, error");
  }
  return normalized as AppConfig["logLevel"];
}

/**
 * Build the application configuration from an env-like record.
 *
 * @param env - Usually `process.env`; anything record-shaped for tests.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: parsePort(env.DEVSTATS_PORT),
    logLevel: parseLogLevel(env.DEVSTATS_LOG_LEVEL),
    service: env.DEVSTATS_SERVICE?.trim() || "devstats",
  };
}
