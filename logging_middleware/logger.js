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

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYjA4NjNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5ODgxMiwiaWF0IjoxNzc3Njk3OTEyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjVjNWVlNTMtNzBjMi00NzIwLThlMjctNTRhYTJiYTQ3YzY0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2FydGlrIGJhbGFqaSIsInN1YiI6IjRlN2FlNzUyLWJhMjItNDM1MC1hZWFhLTNjYjY3MjViMDQ1MiJ9LCJlbWFpbCI6ImtiMDg2M0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImthcnRpayBiYWxhamkiLCJyb2xsTm8iOiJyYTIzMTEwMjcwNTAwMDMiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI0ZTdhZTc1Mi1iYTIyLTQzNTAtYWVhYS0zY2I2NzI1YjA0NTIiLCJjbGllbnRTZWNyZXQiOiJ0dFpnaEhLSmZCa3ladWJOIn0.gh91SC10Z3p79cPkkZpAp-F2ksitTyvUUCoSQ8WC2xs";

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