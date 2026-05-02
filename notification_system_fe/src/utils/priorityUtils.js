const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function getNotificationId(notification) {
  return notification.ID;
}

export function getNotificationType(notification) {
  return notification.Type || "Event";
}

export function getNotificationMessage(notification) {
  return notification.Message || "No message available.";
}

export function getNotificationTimestamp(notification) {
  return notification.Timestamp || "";
}

export function parseNotificationTimestamp(timestamp) {
  if (!timestamp) {
    return Date.now();
  }

  return new Date(timestamp.replace(" ", "T")).getTime();
}

export function calculatePriorityScore(notification) {
  const type = getNotificationType(notification);
  const typeWeight = TYPE_WEIGHTS[type] || 0;

  const createdAt = parseNotificationTimestamp(getNotificationTimestamp(notification));
  const currentTime = Date.now();

  const ageSeconds = Math.max((currentTime - createdAt) / 1000, 1);
  const recencyScore = 1 / ageSeconds;

  return typeWeight + recencyScore;
}

export function getPriorityNotifications(notifications, limit) {
  return [...notifications]
    .sort((first, second) => {
      return calculatePriorityScore(second) - calculatePriorityScore(first);
    })
    .slice(0, limit);
}