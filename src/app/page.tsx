"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box, Typography } from "@mui/material";
import { getUserClient } from "../api/auth/getUserClient";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // No token → redirect to signin
      if (!token) {
        router.replace("/signin");
        return;
      }

      // Has token → verify it with backend
      const user = await getUserClient();
      if (user) {
        // logged in → go to attendance page
        router.replace("/user/attendance");
      } else {
        // invalid token → redirect to signin
        localStorage.removeItem("access_token");
        router.replace("/signin");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6">Checking authentication...</Typography>
    </Box>
  );
}
