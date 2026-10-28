import test from "node:test";
import assert from "node:assert/strict";

import { loadConfig, ConfigError } from "./config";

test("falls back to defaults when nothing is configured", () => {
  assert.deepEqual(loadConfig({}), {
    port: 3000,
    logLevel: "info",
    service: "devstats",
  });
});

test("accepts valid configuration values", () => {
  const config = loadConfig({
    DEVSTATS_PORT: "8080",
    DEVSTATS_LOG_LEVEL: "warn",
    DEVSTATS_SERVICE: " stats-worker ",
  });
  assert.equal(config.port, 8080);
  assert.equal(config.logLevel, "warn");
  assert.equal(config.service, "stats-worker");
});

test("rejects out-of-range ports", () => {
  assert.throws(() => loadConfig({ DEVSTATS_PORT: "70000" }), ConfigError);
  assert.throws(() => loadConfig({ DEVSTATS_PORT: "not-a-number" }), ConfigError);
});

test("rejects unknown log levels", () => {
  assert.throws(() => loadConfig({ DEVSTATS_LOG_LEVEL: "verbose" }), ConfigError);
});
