"use client";

import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Stack,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { sendAttendance, Attendance } from "@/api/attendance/attendanceClient";

export default function AttendancePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [record, setRecord] = useState<Attendance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAttendance = async (status: "checkin" | "checkout") => {
    if (!navigator.geolocation) {
      setMessage("お使いのブラウザは位置情報をサポートしていません。");
      setOpenDialog(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await sendAttendance(status, latitude, longitude);
      if (res) {
        const timeOnly = new Date(res.date).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setRecord(res);
        setMessage(
          `✅ ${status === "checkin" ? "出勤" : "退勤"} が記録されました。\n記録時刻: ${timeOnly}`,
        );
      } else {
        setRecord(null);
        setMessage("❌ 勤怠の記録に失敗しました。もう一度お試しください。");
      }
      setOpenDialog(true);
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessage(null);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        maxWidth: "1600px",
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {record ? "✅ 勤怠が記録されました" : "❌ エラー"}
          </DialogTitle>
          <DialogContent
            sx={{ whiteSpace: "pre-line", fontSize: "1rem", mt: 1 }}
          >
            {message}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
