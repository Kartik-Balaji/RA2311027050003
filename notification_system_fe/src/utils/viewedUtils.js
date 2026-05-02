import { getNotificationId } from "./priorityUtils";

export function isNotificationViewed(notification) {
  const notificationId = getNotificationId(notification);

  if (!notificationId) {
    return false;
  }

  return localStorage.getItem(`viewed-notification-${notificationId}`) === "true";
}

export function markNotificationAsViewed(notification) {
  const notificationId = getNotificationId(notification);

  if (!notificationId) {
    return;
  }

  localStorage.setItem(`viewed-notification-${notificationId}`, "true");
}