import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

export default function NotificationFilters({
  notificationType,
  setNotificationType,
  limit,
  setLimit,
  page,
  setPage,
  showLimit = false,
  showPagination = false,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={notificationType}
            label="Type"
            onChange={(event) => {
              setNotificationType(event.target.value);
              setPage?.(1);
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        {showLimit && (
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Top</InputLabel>
            <Select
              value={limit}
              label="Top"
              onChange={(event) => setLimit(Number(event.target.value))}
            >
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
        )}

        {showPagination && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <Button variant="contained" disableElevation>
              Page {page}
            </Button>

            <Button variant="outlined" onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}