"use client";

import { Container, Typography, CircularProgress } from "@mui/material";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminPage() {
  const { user, loading } = useAdminAuth();

  if (loading)
    return (
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        maxWidth: "1600px",
        px: 3,
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        mb={5}
        color="primary"
        fontWeight="bold"
        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
        管理ページへようこそ！
      </Typography>

      <Typography variant="h6">
        管理者名: {user?.firstname} {user?.lastname}
      </Typography>
    </Container>
  );
}
