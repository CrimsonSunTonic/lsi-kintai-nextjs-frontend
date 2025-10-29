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
  Paper,
} from "@mui/material";
import { Attendance } from "@/api/attendance/attendanceClient";
import { fetchAttendanceStatus } from "@/api/attendance/fetchAttendanceStatusClient";
import { handleAttendanceAction } from "@/utils/attendanceHandler";

export default function AttendancePage() {
  const [message, setMessage] = useState<string | null>(null);
  const [record, setRecord] = useState<Attendance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<
    "checkin" | "checkout" | "lunchin" | "lunchout" | null
  >(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [lunchIn, setLunchIn] = useState(false);
  const [lunchOut, setLunchOut] = useState(false);

  useEffect(() => {
    fetchAttendanceStatus()
      .then((status) => {
        setCheckedIn(status.checkedIn);
        setCheckedOut(status.checkedOut);
        setLunchIn(status.lunchIn);
        setLunchOut(status.lunchOut);
      })
      .catch(() => {
        setMessage("ステータスの取得に失敗しました。");
        setOpenDialog(true);
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleAttendance = async (
    status: "checkin" | "checkout" | "lunchin" | "lunchout"
  ) => {
    setLoading(true);
    setActiveButton(status);

    const result = await handleAttendanceAction(status);
    setRecord(result.record);
    setMessage(result.message);
    setOpenDialog(true);

    if (result.success) {
      switch (status) {
        case "checkin":
          setCheckedIn(true);
          break;
        case "checkout":
          setCheckedOut(true);
          break;
        case "lunchin":
          setLunchIn(true);
          break;
        case "lunchout":
          setLunchOut(true);
          break;
      }
    }

    setLoading(false);
    setActiveButton(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMessage(null);
  };

    // --- Simplified logic flags ---
  const isWorking = checkedIn && !checkedOut;
  const isLunching = lunchIn && !lunchOut;
  const isFinished = checkedOut;

  // --- Disable logic (cleaner & readable) ---
  const disableCheckIn = loading || checkedIn || isWorking || isLunching || isFinished;
  const disableLunchIn = loading || !isWorking || isLunching || lunchIn;
  const disableLunchOut = loading || !lunchIn || lunchOut || isFinished;
  const disableCheckOut = loading || !checkedIn || isLunching || isFinished;

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
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
          backgroundColor: "#f8fafc",
        }}
      >
        <Paper
          elevation={4}
          className="rounded-3xl p-10 shadow-lg bg-white text-center"
        >
          <Typography
            variant="h3"
            mb={5}
            fontWeight="bold"
            color="primary"
            sx={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            勤怠システム
          </Typography>

          <Stack direction="column" spacing={4} alignItems="center">
            {/* 出勤 */}
            <Button
              variant={checkedIn ? "outlined" : "contained"}
              color="success"
              size="large"
              sx={{
                width: 220,
                py: 2,
                fontSize: "1.25rem",
                borderRadius: 4,
                textTransform: "none",
              }}
              onClick={() => handleAttendance("checkin")}
              disabled={disableCheckIn}
            >
              {loading && activeButton === "checkin" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "出勤"
              )}
            </Button>

            {/* 昼食入り */}
            <Button
              variant={lunchIn ? "outlined" : "contained"}
              color="warning"
              size="large"
              sx={{
                width: 220,
                py: 2,
                fontSize: "1.25rem",
                borderRadius: 4,
                textTransform: "none",
              }}
              onClick={() => handleAttendance("lunchin")}
              disabled={disableLunchIn}
            >
              {loading && activeButton === "lunchin" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "昼食入り"
              )}
            </Button>

            {/* 昼食戻り */}
            <Button
              variant={lunchOut ? "outlined" : "contained"}
              color="info"
              size="large"
              sx={{
                width: 220,
                py: 2,
                fontSize: "1.25rem",
                borderRadius: 4,
                textTransform: "none",
              }}
              onClick={() => handleAttendance("lunchout")}
              disabled={disableLunchOut}
            >
              {loading && activeButton === "lunchout" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "昼食戻り"
              )}
            </Button>

            {/* 退勤 */}
            <Button
              variant={checkedOut ? "outlined" : "contained"}
              color="error"
              size="large"
              sx={{
                width: 220,
                py: 2,
                fontSize: "1.25rem",
                borderRadius: 4,
                textTransform: "none",
              }}
              onClick={() => handleAttendance("checkout")}
              disabled={disableCheckOut}
            >
              {loading && activeButton === "checkout" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "退勤"
              )}
            </Button>
          </Stack>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {record ? "✅ 勤怠が記録されました" : "❌ エラー"}
          </DialogTitle>
          <DialogContent sx={{ whiteSpace: "pre-line", fontSize: "1rem", mt: 1 }}>
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
