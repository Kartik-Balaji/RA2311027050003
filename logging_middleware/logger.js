const ALLOWED_STACK = ["frontend", "backend"];
const ALLOWED_LEVEL = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGE = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
];

const LOGGING_API_URL = "http://20.207.122.201/evaluation-service/logs";

const BEARER_TOKEN = "YOUR_TOKEN_HERE";

const DEFAULT_STACK = "frontend";
const DEFAULT_LEVEL = "info";
const DEFAULT_PACKAGE = "api";

function logEvent({ stack, level, package: pkg, message }) {
  const resolvedStack = stack || DEFAULT_STACK;
  const resolvedLevel = level || DEFAULT_LEVEL;
  const resolvedPackage = pkg || DEFAULT_PACKAGE;

  if (!ALLOWED_STACK.includes(resolvedStack)) {
    return;
  }

  if (!ALLOWED_LEVEL.includes(resolvedLevel)) {
    return;
  }

  if (!ALLOWED_PACKAGE.includes(resolvedPackage)) {
    return;
  }

  fetch(LOGGING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify({
      stack: resolvedStack,
      level: resolvedLevel,
      package: resolvedPackage,
      message,
    }),
  }).catch(() => {});
}

module.exports = { logEvent, ALLOWED_STACK, ALLOWED_LEVEL, ALLOWED_PACKAGE };