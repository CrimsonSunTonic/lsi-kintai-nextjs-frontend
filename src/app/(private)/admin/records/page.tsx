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
import * as XLSX from "xlsx";

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

// Add this utility function for time calculation
function parseTime(str: string) {
  // "HH:MM" or "H:MM"
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

function roundToHalfHour(minutes: number) {
  return Math.floor(minutes / 30) * 0.5;
}

function calcWorkTimes(checkin: string, checkout: string, weekday: string) {
  if (!checkin || !checkout) return { actual: "", normalOt: "", midnightOt: "" };

  let start = parseTime(checkin);
  let end = parseTime(checkout);
  if (end < start) end += 24 * 60; // handle overnight

  // Subtract break times
  const breaks = [
    [8 * 60, 9 * 60],
    [12 * 60, 13 * 60],
    [19 * 60, 20 * 60],
    [2 * 60, 3 * 60],
  ];
  let workMinutes = end - start;
  breaks.forEach(([bStart, bEnd]) => {
    // If break overlaps with work time
    const overlap = Math.max(0, Math.min(end, bEnd) - Math.max(start, bStart));
    workMinutes -= overlap;
  });

  // 実働時間
  const actual = roundToHalfHour(workMinutes);

  // 普通残業
  let normalOt = "";
  if (!["土", "日"].includes(weekday) && actual >= 9) {
    const roundedNormalOt = roundToHalfHour((actual - 8) * 60);
    normalOt = roundedNormalOt < 1 ? "" : String(roundedNormalOt);
  }

  // 深夜残業 (22:30-4:00)
  let midnightOtMinutes = 0;
  const midnightRanges = [
    [22 * 60 + 30, 24 * 60],
    [0, 4 * 60],
  ];
  midnightRanges.forEach(([mStart, mEnd]) => {
    const overlap = Math.max(0, Math.min(end, mEnd) - Math.max(start, mStart));
    // Subtract breaks in midnight range
    breaks.forEach(([bStart, bEnd]) => {
      if (bEnd <= mStart || bStart >= mEnd) return;
      const bOverlap = Math.max(0, Math.min(mEnd, bEnd) - Math.max(mStart, bStart));
      midnightOtMinutes -= bOverlap;
    });
    midnightOtMinutes += overlap;
  });
  const midnightOt = midnightOtMinutes > 0 ? roundToHalfHour(midnightOtMinutes) : "";

  return { actual, normalOt, midnightOt };
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

  // Export handlers
  const handleExportExcel = () => {
    const tableName = `${selectedUserName} ${year}年${month}月の勤務表`;
    const wsData = [
      [
        "日付",
        "曜日",
        "出勤時刻",
        "退勤時刻",
        "実働時間",
        "普通残業",
        "深夜残業",
      ],
      ...records.map((rec) => {
        const { actual, normalOt, midnightOt } = calcWorkTimes(rec.checkin || "", rec.checkout || "", rec.weekday);
        return [
          rec.day,
          rec.weekday,
          rec.checkin || "-",
          rec.checkout || "-",
          actual || "",
          normalOt || "",
          midnightOt || "",
        ];
      }),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${tableName}.xlsx`);
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
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
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="success"
              onClick={handleExportExcel}
              disabled={records.length === 0}
            >
              印刷(エクセル)
            </Button>
          </Box>
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
                    <TableCell sx={{ fontWeight: "bold" }}>出勤時刻</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>退勤時刻</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>実働時間</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>普通残業</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>深夜残業</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((rec) => {
                    let bgColor = "inherit";
                    let textColor = "inherit";
                    if (rec.weekday === "土") {
                      bgColor = "#e3f2fd";
                      textColor = "#0d47a1";
                    } else if (rec.weekday === "日") {
                      bgColor = "#ffebee";
                      textColor = "#b71c1c";
                    }
                    const { actual, normalOt, midnightOt } = calcWorkTimes(rec.checkin || "", rec.checkout || "", rec.weekday);
                    return (
                      <TableRow key={rec.day} sx={{ backgroundColor: bgColor }}>
                        <TableCell sx={{ color: textColor, fontWeight: "bold" }}>{rec.day}</TableCell>
                        <TableCell sx={{ color: textColor, fontWeight: "bold" }}>{rec.weekday}</TableCell>
                        <TableCell sx={{ color: "green", fontWeight: "bold" }}>{rec.checkin || "-"}</TableCell>
                        <TableCell sx={{ color: "red", fontWeight: "bold" }}>{rec.checkout || "-"}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{actual || ""}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{normalOt || ""}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{midnightOt || ""}</TableCell>
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
