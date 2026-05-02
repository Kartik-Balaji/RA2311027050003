import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

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
      try {
        setLoading(true);
        setError("");

        const data = await fetchNotifications({
          limit: 10,
          page,
          notificationType,
        });

        if (isActive) {
          setNotifications(data);
        }
      } catch {
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
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <Checkbox sx={{ mr: 2 }} />
        
        <IconButton sx={{ mr: 1 }}>
          <RefreshIcon />
        </IconButton>
        
        <IconButton sx={{ mr: 2 }}>
          <FilterListIcon />
        </IconButton>

        <NotificationFilters
          notificationType={notificationType}
          setNotificationType={setNotificationType}
          page={page}
          setPage={setPage}
          showPagination
        />
      </Paper>

      <Paper sx={{ minHeight: 500 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #efefef" }}>
          <Typography variant="h6" sx={{ fontWeight: 400, color: "#202124" }}>
            All Messages
          </Typography>
        </Box>

        {error && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && !error && notifications.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications found.</Typography>
          </Box>
        )}

        <Stack spacing={0} key={refreshKey}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              onViewed={handleViewed}
            />
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}