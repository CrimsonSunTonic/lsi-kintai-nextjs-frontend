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
} from "@mui/material";
import { getAttendanceClient, AttendanceRecord } from "@/api/attendance/getAttendanceClient";

export default function UserRecordsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      const data = await getAttendanceClient();
      if (data.length === 0) setError("No attendance records found or failed to fetch.");
      setRecords(data);
      setLoading(false);
    };

    fetchRecords();
  }, []);

  return (
    <Container
        maxWidth="xl"
        sx={{
            width: "100%",      
            maxWidth: "1600px", 
            px: 3,              
        }}
    >
        <Box sx={{ p: 4 }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
            Attendance Records
        </Typography>

        {error && <Alert severity="warning">{error}</Alert>}

        {!error && (
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
                        style={{
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

        {loading && !error && <Typography mt={2}>Loading records...</Typography>}
        </Box>
    </Container>
  );
}
