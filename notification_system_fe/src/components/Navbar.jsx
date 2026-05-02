import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Campus Notifications
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button color="inherit" component={RouterLink} to="/all-notifications">
            All
          </Button>

          <Button color="inherit" component={RouterLink} to="/priority-notifications">
            Priority
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}