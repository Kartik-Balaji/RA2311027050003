import { logEvent, BEARER_TOKEN } from "./loggerService";

const NOTIFICATIONS_API_URL = "/notifications";

export async function fetchNotifications({
  limit = 10,
  page = 1,
  notificationType = "All",
}) {
  const url = new URL(NOTIFICATIONS_API_URL, window.location.origin);

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("page", String(page));

  if (notificationType !== "All") {
    url.searchParams.set("notification_type", notificationType);
  }

  await logEvent({
    stack: "frontend",
    level: "info",
    packageName: "api",
    message: `Fetching notifications. limit=${limit}, page=${page}, type=${notificationType}`,
  });

  console.log("Fetching from:", url.toString());
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Accept": "application/json",
      },
    });

    console.log("Notifications response status:", response.status);
    
    if (!response.ok) {
      const errText = await response.text();
      console.log("Notifications error response:", errText);
      await logEvent({
        stack: "frontend",
        level: "error",
        packageName: "api",
        message: `Notification API failed with status ${response.status}`,
      });

      throw new Error("Unable to fetch notifications");
    }

    const data = JSON.parse(responseText);
        stack: "frontend",
        level: "error",
        packageName: "api",
        message: `Notification API failed with status ${response.status}`,
      });

      throw new Error("Unable to fetch notifications");
    }

    const data = await response.json();

    await logEvent({
      stack: "frontend",
      level: "info",
      packageName: "api",
      message: "Notification API request completed successfully",
    });

    if (Array.isArray(data.notifications)) {
      return data.notifications;
    }

    await logEvent({
      stack: "frontend",
      level: "warn",
      packageName: "api",
      message: "Notification API response did not contain notifications array",
    });

    return [];
  } catch (error) {
    await logEvent({
      stack: "frontend",
      level: "error",
      packageName: "api",
      message:
        error instanceof Error
          ? `Failed to fetch notifications: ${error.message}`
          : "Failed to fetch notifications due to unknown error",
    });

    throw error;
  }
}