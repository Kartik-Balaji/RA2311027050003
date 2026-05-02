import { Paper, Typography, Chip, Box, IconButton } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";

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

function getTypeColor(type) {
  if (type === "Placement") return "#1a73e8";
  if (type === "Result") return "#ea4335";
  return "#fbbc04";
}

function getTypeBgColor(type) {
  if (type === "Placement") return "#e8f0fe";
  if (type === "Result") return "#fce8e6";
  return "#fef7e0";
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
    <Paper
      onClick={handleClick}
      elevation={viewed ? 0 : 1}
      sx={{
        p: 2,
        mb: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        bgcolor: viewed ? "#fafafa" : "white",
        borderBottom: "1px solid #efefef",
        "&:hover": {
          boxShadow: 1,
          borderBottom: "1px solid #dadce0",
        },
      }}
    >
      <Box sx={{ width: 40, mr: 2, display: 'flex', justifyContent: 'center' }}>
        <IconButton size="small" sx={{ color: "#5f6368" }}>
          <StarBorderIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ minWidth: 100 }}>
        <Chip 
          label={type} 
          size="small"
          sx={{ 
            bgcolor: getTypeBgColor(type),
            color: getTypeColor(type),
            fontWeight: 500,
            fontSize: 12,
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: viewed ? 400 : 500,
            color: "#202124",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {message}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 150, textAlign: 'right' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: viewed ? "#5f6368" : "#202124",
            fontWeight: viewed ? 400 : 500,
            fontSize: 12,
          }}
        >
          {timestamp}
        </Typography>
      </Box>

      <Box sx={{ width: 60, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
        <IconButton size="small" sx={{ color: "#5f6368" }}>
          <ArchiveIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: "#5f6368" }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}