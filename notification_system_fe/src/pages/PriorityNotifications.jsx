import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import NotificationCard from "../components/NotificationCard";
import NotificationFilters from "../components/NotificationFilters";
import { fetchNotifications } from "../services/notificationService";
import { getPriorityNotifications } from "../utils/priorityUtils";
import { isNotificationViewed } from "../utils/viewedUtils";

export default function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState("All");
  const [limit, setLimit] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchNotifications({
          limit: 10,
          page: 1,
          notificationType,
        });

        if (isActive) {
          setNotifications(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load priority notifications. Please try again.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    const intervalId = setInterval(loadNotifications, 30000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [notificationType]);

  const priorityNotifications = useMemo(() => {
    const unreadNotifications = notifications.filter(
      (notification) => !isNotificationViewed(notification)
    );

    return getPriorityNotifications(unreadNotifications, limit);
  }, [notifications, limit, refreshKey]);

  function handleViewed() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Priority Notifications
        </Typography>

        <Typography color="text.secondary">
          Shows the most important unread notifications first using type priority
          and recency.
        </Typography>
      </Box>

      <NotificationFilters
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        limit={limit}
        setLimit={setLimit}
        showLimit
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && priorityNotifications.length === 0 && (
        <Alert severity="info">
          No unread priority notifications found.
        </Alert>
      )}

      <Stack spacing={2} key={refreshKey}>
        {priorityNotifications.map((notification) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            onViewed={handleViewed}
          />
        ))}
      </Stack>
    </Container>
  );
}