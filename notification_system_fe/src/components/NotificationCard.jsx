import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

import {
  getNotificationId,
  getNotificationMessage,
  getNotificationTimestamp,
  getNotificationType,
} from "../utils/priorityUtils";

import {
  isNotificationViewed,
  markNotificationAsViewed,
} from "../utils/viewedUtils";

function getChipColor(type) {
  if (type === "Placement") {
    return "success";
  }

  if (type === "Result") {
    return "primary";
  }

  return "warning";
}

export default function NotificationCard({ notification, onViewed }) {
  const id = getNotificationId(notification);
  const type = getNotificationType(notification);
  const message = getNotificationMessage(notification);
  const timestamp = getNotificationTimestamp(notification);
  const viewed = isNotificationViewed(notification);

  function handleClick() {
    markNotificationAsViewed(notification);

    if (onViewed) {
      onViewed(id);
    }
  }

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        opacity: viewed ? 0.65 : 1,
        borderLeft: viewed ? "4px solid #9ca3af" : "4px solid #1976d2",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
          <Chip label={type} color={getChipColor(type)} size="small" />

          <Chip
            label={viewed ? "Viewed" : "New"}
            color={viewed ? "default" : "secondary"}
            size="small"
          />
        </Stack>

        <Typography variant="body1" sx={{ fontWeight: viewed ? 400 : 700 }}>
          {message}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {timestamp}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          ID: {id}
        </Typography>
      </CardContent>
    </Card>
  );
}