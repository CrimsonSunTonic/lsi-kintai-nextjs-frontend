"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { getAttendanceMonthlyClient } from "@/api/attendance/getAttendanceMonthlyClient";
import { getAllUsersClient } from "@/api/user/getAllUsersClient";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  latitude: number;
  longitude: number;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface GroupedRecord {
  day: number; // only day number
  weekday: string;
  checkin?: string;
  checkout?: string;
}

export default function UserRecordsPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const [records, setRecords] = useState<GroupedRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // ✅ Fetch all users
  useEffect(() => {
    if (authLoading || !user) return;
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersClient();
        setUsers(data);
      } catch {
        setError("Failed to fetch user list.");
      }
    };
    fetchUsers();
  }, [authLoading, user]);

  // ✅ Generate all days in the month
  const generateAllDays = (year: number, month: number): GroupedRecord[] => {
    const days: GroupedRecord[] = [];
    const date = new Date(year, month - 1, 1);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    while (date.getMonth() + 1 === month) {
      const weekday = weekdays[date.getDay()];
      days.push({ day: date.getDate(), weekday });
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // ✅ Fetch and merge attendance
  const handleFetch = async () => {
    if (!selectedUser) {
      setError("Please select a user first.");
      return;
    }

    setError(null);
    setDataLoading(true);

    try {
      const data: AttendanceRecord[] = await getAttendanceMonthlyClient(
        selectedUser,
        month,
        year
      );

      // Group attendance by date string (YYYY-MM-DD)
      const grouped: Record<string, { checkin?: string; checkout?: string }> = {};

      data.forEach((rec) => {
        const dateObj = new Date(rec.date);
        const dateKey = dateObj.toISOString().split("T")[0];
        const time = dateObj.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!grouped[dateKey]) grouped[dateKey] = {};

        if (rec.status === "checkin" && !grouped[dateKey].checkin)
          grouped[dateKey].checkin = time;
        if (rec.status === "checkout")
          grouped[dateKey].checkout = time;
      });

      // Merge with all days of month
      const allDays = generateAllDays(year, month);
      const fullRecords = allDays.map((d) => {
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
        const dayData = grouped[dateKey] || {};
        return {
          day: d.day,
          weekday: d.weekday,
          checkin: dayData.checkin || "",
          checkout: dayData.checkout || "",
        };
      });

      setRecords(fullRecords);
    } catch {
      setError("Failed to fetch attendance records.");
    } finally {
      setDataLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: "1600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Checking admin access...
        </Typography>
      </Container>
    );
  }

  const selectedUserName =
    users.find((u) => u.id === selectedUser)?.firstname +
      " " +
      users.find((u) => u.id === selectedUser)?.lastname || "";

  return (
    <Container maxWidth="xl" sx={{ width: "100%", maxWidth: "1600px", px: 3 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
          勤怠記録管理
        </Typography>

        {/* Controls */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>社員選択</InputLabel>
            <Select
              value={selectedUser}
              label="User"
              onChange={(e) => setSelectedUser(Number(e.target.value))}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.firstname} {u.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>月</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>年</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
                (y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleFetch}
            disabled={dataLoading}
          >
            {dataLoading ? "Loading..." : "Confirm"}
          </Button>
        </Box>

        {error && <Alert severity="warning">{error}</Alert>}

        {!error && records.length > 0 && (
          <>
            {/* ✅ Table title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textAlign: "center",
                color: "#333",
              }}
            >
              {selectedUserName}　{year}年{month}月の勤務表
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>日付</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>曜日</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>出勤</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>退勤</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                    {records.map((rec) => {
                      let bgColor = "inherit";
                      let textColor = "inherit";

                      if (rec.weekday === "土") {
                        bgColor = "#e3f2fd"; // light blue for Saturday
                        textColor = "#0d47a1"; // deep blue text
                      } else if (rec.weekday === "日") {
                        bgColor = "#ffebee"; // light red for Sunday
                        textColor = "#b71c1c"; // deep red text
                      }

                      return (
                        <TableRow key={rec.day} sx={{ backgroundColor: bgColor }}>
                          <TableCell sx={{ color: textColor, fontWeight: "bold" }}>
                            {rec.day}
                          </TableCell>
                          <TableCell sx={{ color: textColor, fontWeight: "bold" }}>
                            {rec.weekday}
                          </TableCell>
                          <TableCell sx={{ color: "green", fontWeight: "bold" }}>
                            {rec.checkin || "-"}
                          </TableCell>
                          <TableCell sx={{ color: "red", fontWeight: "bold" }}>
                            {rec.checkout || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>

              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Container>
  );
}
