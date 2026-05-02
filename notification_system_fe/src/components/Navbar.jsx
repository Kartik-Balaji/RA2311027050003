import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

export default function Navbar() {
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: "white" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" sx={{ mr: 2, color: "#5f6368" }}>
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            color: "#5f6368",
            fontFamily: "'Google Sans', 'Roboto', sans-serif",
            fontWeight: 400,
          }}
        >
          Campus Notifications
        </Typography>

        <Box sx={{ 
          flexGrow: 1, 
          maxWidth: 600, 
          mx: 3,
          bgcolor: "#f1f3f4",
          borderRadius: 2,
          px: 2,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
        }}>
          <SearchIcon sx={{ color: "#5f6368", mr: 1 }} />
          <input 
            type="text" 
            placeholder="Search notifications" 
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              flex: 1,
              fontSize: 14,
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/all-notifications"
            sx={{ 
              color: "#5f6368",
              fontSize: 14,
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            All
          </Button>

          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/priority-notifications"
            sx={{ 
              color: "#5f6368",
              fontSize: 14,
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Priority
          </Button>
        </Stack>

        <IconButton sx={{ ml: 2, color: "#5f6368" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#1a73e8", fontSize: 14 }}>
            K
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}