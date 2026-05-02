import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "./components/Navbar";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/all-notifications" replace />} />
        <Route path="/all-notifications" element={<AllNotifications />} />
        <Route path="/priority-notifications" element={<PriorityNotifications />} />
      </Routes>
    </Box>
  );
}