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

export default function UserRecordsPage() {
  const { user, loading: authLoading } = useAdminAuth(); // ✅ check admin
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const token = localStorage.getItem("access_token");
  console.log("token:", token);

  // ✅ Fetch user list (for admin)
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

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

  // ✅ Handle attendance fetch
  const handleFetch = async () => {
    if (!selectedUser) {
      setError("Please select a user first.");
      return;
    }

    setError(null);
    setDataLoading(true);
    try {
      const data = await getAttendanceMonthlyClient(selectedUser, month, year);
      setRecords(data);
      if (data.length === 0) setError("No attendance records found for this user and month.");
    } catch {
      setError("Failed to fetch attendance records.");
    } finally {
      setDataLoading(false);
    }
  };

  // ✅ Loading phase
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

  return (
    <Container maxWidth="xl" sx={{ width: "100%", maxWidth: "1600px", px: 3 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
          勤怠記録管理
        </Typography>

        {/* Selection Controls */}
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
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
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

        {/* Display Data */}
        {error && <Alert severity="warning">{error}</Alert>}

        {!error && records.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Latitude</TableCell>
                  <TableCell>Longitude</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                    <TableCell
                      sx={{
                        color: record.status === "checkin" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {record.status.toUpperCase()}
                    </TableCell>
                    <TableCell>{record.latitude.toFixed(4)}</TableCell>
                    <TableCell>{record.longitude.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}
