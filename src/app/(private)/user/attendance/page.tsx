"use client";

import { useState } from "react";
import { Button, Typography, Box, Alert, Stack, Container } from "@mui/material";
import { sendAttendance, Attendance } from "@/api/attendance/attendanceClient";

export default function AttendancePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [record, setRecord] = useState<Attendance | null>(null);

  const handleAttendance = async (status: "checkin" | "checkout") => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await sendAttendance(status, latitude, longitude);
      if (res) {
        const localTime = new Date(res.date).toLocaleString();
        setRecord(res);
        setMessage(
          `✅ ${status.toUpperCase()} recorded at ${localTime}\nLat: ${latitude.toFixed(
            4
          )}, Lng: ${longitude.toFixed(4)}`
        );
      } else {
        setMessage("❌ Failed to record attendance. Try again.");
      }
    });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",       // full width
        maxWidth: "1600px",  // or whatever max width you want
        px: 3,               // horizontal padding
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // vertical center
          alignItems: "center", // horizontal center
          minHeight: "100vh",
          textAlign: "center",
          backgroundColor: "#f9fafb",
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          mb={5}
          color="primary"
          fontWeight="bold"
          sx={{ textTransform: "uppercase", letterSpacing: 1 }}
        >
          勤怠システム
        </Typography>

        <Stack direction="column" spacing={4} alignItems="center">
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ width: 200, py: 2, fontSize: "1.25rem", borderRadius: 3 }}
            onClick={() => handleAttendance("checkin")}
          >
            出勤
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ width: 200, py: 2, fontSize: "1.25rem", borderRadius: 3 }}
            onClick={() => handleAttendance("checkout")}
          >
            退勤
          </Button>
        </Stack>

        {message && (
          <Alert
            severity={record ? "success" : "error"}
            sx={{
              mt: 5,
              width: "80%",
              maxWidth: 500,
              whiteSpace: "pre-line",
              fontSize: "1rem",
            }}
          >
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
