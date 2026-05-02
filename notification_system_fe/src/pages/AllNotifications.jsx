import { useEffect, useState } from "react";
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

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState("All");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadNotifications() {
      console.log("AllNotifications: Starting to load...");
      try {
        setLoading(true);
        setError("");

        console.log("AllNotifications: Calling fetch with", { limit: 10, page, notificationType });
        
        const data = await fetchNotifications({
          limit: 10,
          page,
          notificationType,
        });

        console.log("AllNotifications: Got data:", data);

        if (isActive) {
          setNotifications(data);
        }
      } catch (err) {
        console.log("AllNotifications: Error:", err.message);
        if (isActive) {
          setError("Unable to load notifications. Please try again.");
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
  }, [notificationType, page]);

  function handleViewed() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          All Notifications
        </Typography>

        <Typography color="text.secondary">
          Browse campus updates across placements, results, and events.
        </Typography>
      </Box>

      <NotificationFilters
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        page={page}
        setPage={setPage}
        showPagination
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      <Stack spacing={2} key={refreshKey}>
        {notifications.map((notification) => (
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