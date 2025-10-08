"use client";

import { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { sendAttendance, Attendance } from "@/api/attendance/attendanceClient";
import { fetchAttendanceStatus } from "@/api/attendance/fetchAttendanceStatusClient";

export default function AttendancePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [record, setRecord] = useState<Attendance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<"checkin" | "checkout" | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceStatus()
      .then((status) => {
        setCheckedIn(status.checkedIn);
        setCheckedOut(status.checkedOut);
      })
      .catch(() => {
        setMessage("ステータスの取得に失敗しました。");
        setOpenDialog(true);
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleAttendance = async (status: "checkin" | "checkout") => {
    if (!navigator.geolocation) {
      setMessage("お使いのブラウザは位置情報をサポートしていません。");
      setOpenDialog(true);
      return;
    }

    setLoading(true);
    setActiveButton(status);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await sendAttendance(status, latitude, longitude);
      if (res) {
        const dateObj = new Date(res.date);
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");

        const timeOnly = `${hours}:${minutes}`;

        setRecord(res);
        setMessage(
          `✅ ${status === "checkin" ? "出勤" : "退勤"} が記録されました。\n記録時刻: ${timeOnly}`,
        );
        if (status === "checkin") setCheckedIn(true);
        if (status === "checkout") setCheckedOut(true);
      } else {
        setRecord(null);
        setMessage("❌ 勤怠の記録に失敗しました。もう一度お試しください。");
      }
      setLoading(false);
      setActiveButton(null);
      setOpenDialog(true);
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessage(null);
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

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
          {/* 出勤ボタン */}
          <Button
            variant={checkedIn ? "outlined" : "contained"}
            color={checkedIn ? "inherit" : "success"}
            size="large"
            sx={{ width: 200, py: 2, fontSize: "1.25rem", borderRadius: 3 }}
            onClick={() => handleAttendance("checkin")}
            disabled={checkedIn || loading}
          >
            {loading && activeButton === "checkin" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "出勤"
            )}
          </Button>

          {/* 退勤ボタン */}
          <Button
            variant={checkedOut ? "outlined" : "contained"}
            color={checkedOut ? "inherit" : "error"}
            size="large"
            sx={{ width: 200, py: 2, fontSize: "1.25rem", borderRadius: 3 }}
            onClick={() => handleAttendance("checkout")}
            disabled={checkedOut || loading}
          >
            {loading && activeButton === "checkout" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "退勤"
            )}
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
