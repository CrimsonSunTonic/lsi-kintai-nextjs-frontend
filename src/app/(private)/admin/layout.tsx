"use client";

import { Box, Container, Typography, Divider } from "@mui/material";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>

      {/* === Main Content === */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container
          maxWidth="xl"
          sx={{
            width: "100%",
            maxWidth: "1600px",
            px: 3,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}
