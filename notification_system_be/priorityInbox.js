const fs = require("fs");
const path = require("path");
const { logEvent, ALLOWED_STACK, ALLOWED_LEVEL, ALLOWED_PACKAGE, BEARER_TOKEN } = require("../logging_middleware/logger");

const NOTIFICATIONS_API_URL =
  "http://20.207.122.201/evaluation-service/notifications";

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function parseNotificationTimestamp(timestamp) {
  if (!timestamp) {
    return Date.now();
  }

  return new Date(timestamp.replace(" ", "T")).getTime();
}

function calculatePriorityScore(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;

  const createdTime = parseNotificationTimestamp(notification.Timestamp);
  const currentTime = Date.now();

  const ageSeconds = Math.max((currentTime - createdTime) / 1000, 1);
  const recencyScore = 1 / ageSeconds;

  return typeWeight + recencyScore;
}

async function fetchNotifications({ limit = 50, page = 1 }) {
  const url = new URL(NOTIFICATIONS_API_URL);

  url.searchParams.set("limit", String(10));
  url.searchParams.set("page", String(page));

  await logEvent({
    stack: "backend",
    level: "info",
    package: "api",
    message: `Fetching notifications from API. limit=${limit}, page=${page}`,
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      await logEvent({
        stack: "backend",
        level: "error",
        package: "api",
        message: `Notification API failed with status ${response.status}`,
      });

      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();

    await logEvent({
      stack: "backend",
      level: "info",
      package: "api",
      message: "Notification API call completed successfully",
    });

    if (Array.isArray(data.notifications)) {
      return data.notifications;
    }

    await logEvent({
      stack: "backend",
      level: "warn",
      package: "api",
      message: "Notification API response did not contain notifications array",
    });

    return [];
  } catch (error) {
    await logEvent({
      stack: "backend",
      level: "fatal",
      package: "api",
      message:
        error instanceof Error
          ? `Failed to fetch notifications: ${error.message}`
          : "Failed to fetch notifications due to unknown error",
    });

    throw error;
  }
}

async function getTopPriorityNotifications(limit = 10) {
  await logEvent({
    stack: "backend",
    level: "info",
    package: "utils",
    message: "Started top priority notification calculation",
  });

  const notifications = await fetchNotifications({
    limit: 20,
    page: 1,
  });

  const scoredNotifications = notifications.map((notification) => ({
    ...notification,
    priorityScore: calculatePriorityScore(notification),
  }));

  scoredNotifications.sort((first, second) => {
    return second.priorityScore - first.priorityScore;
  });

  const topNotifications = scoredNotifications.slice(0, limit);

  await logEvent({
    stack: "backend",
    level: "info",
    package: "utils",
    message: `Calculated top ${limit} priority notifications`,
  });

  return topNotifications;
}

function generateHtmlOutput(priorityNotifications) {
  const rows = priorityNotifications
    .map((notification, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td class="${notification.Type}">${notification.Type}</td>
          <td>${notification.Message}</td>
          <td>${notification.Timestamp}</td>
          <td>${notification.priorityScore.toFixed(6)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Stage 1 Priority Notifications</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            background: #f5f7fb;
          }

          h1 {
            color: #111827;
          }

          p {
            color: #4b5563;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          }

          th, td {
            padding: 12px;
            border: 1px solid #e5e7eb;
            text-align: left;
          }

          th {
            background: #111827;
            color: white;
          }

          .Placement {
            color: #047857;
            font-weight: bold;
          }

          .Result {
            color: #1d4ed8;
            font-weight: bold;
          }

          .Event {
            color: #b45309;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <h1>Stage 1 - Top 10 Priority Notifications</h1>

        <p>
          Notifications are fetched from the provided API.
          No hardcoded notification data or database is used.
          Priority is calculated using notification type weight and recency.
        </p>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Type</th>
              <th>Message</th>
              <th>Timestamp</th>
              <th>Priority Score</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

async function main() {
  try {
    await logEvent({
      stack: "backend",
      level: "info",
      package: "api",
      message: "Stage 1 priority inbox script started",
    });

    const priorityNotifications = await getTopPriorityNotifications(10);

    const outputDirectory = path.join(__dirname, "output");

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    const htmlOutput = generateHtmlOutput(priorityNotifications);

    fs.writeFileSync(
      path.join(outputDirectory, "priority_notifications.html"),
      htmlOutput
    );

    await logEvent({
      stack: "backend",
      level: "info",
      package: "api",
      message: "Stage 1 HTML output generated successfully",
    });
  } catch (error) {
    console.log("Error:", error.message);
  }
}

main();