"use client";

import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

import { calcWorkTimes } from "../utils/attendanceUtils"; // move your calcWorkTimes function here

export interface GroupedRecord {
  day: number;
  weekday: string;
  checkin?: string;
  checkout?: string;
  checkinLoc?: [number, number];
  checkoutLoc?: [number, number];
}

interface AttendanceTableProps {
  records: GroupedRecord[];
  onShowMap: (lat: number, lng: number, label?: string, time?: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onShowMap }) => {
  return (
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
            const { actual, normalOt, midnightOt } = calcWorkTimes(
              rec.checkin || "",
              rec.checkout || "",
              rec.weekday
            );

            let bgColor = "inherit";
            let textColor = "inherit";
            if (rec.weekday === "土") {
              bgColor = "#e3f2fd";
              textColor = "#0d47a1";
            } else if (rec.weekday === "日") {
              bgColor = "#ffebee";
              textColor = "#b71c1c";
            }

            return (
              <TableRow key={rec.day} sx={{ backgroundColor: bgColor }}>
                <TableCell sx={{ color: textColor, fontWeight: "bold" }}>{rec.day}</TableCell>
                <TableCell sx={{ color: textColor, fontWeight: "bold" }}>
                  {rec.weekday}
                </TableCell>

                <TableCell
                  sx={{
                    color: rec.checkinLoc ? "green" : "inherit",
                    textDecoration: rec.checkinLoc ? "underline" : "none",
                    cursor: rec.checkinLoc ? "pointer" : "default",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    rec.checkinLoc &&
                    onShowMap(rec.checkinLoc[0], rec.checkinLoc[1], "出勤位置", rec.checkin || "")
                  }
                >
                  {rec.checkin || "-"}
                </TableCell>

                <TableCell
                  sx={{
                    color: rec.checkoutLoc ? "red" : "inherit",
                    textDecoration: rec.checkoutLoc ? "underline" : "none",
                    cursor: rec.checkoutLoc ? "pointer" : "default",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    rec.checkoutLoc &&
                    onShowMap(rec.checkoutLoc[0], rec.checkoutLoc[1], "退勤位置", rec.checkout || "")
                  }
                >
                  {rec.checkout || "-"}
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>{actual || ""}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{normalOt || ""}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{midnightOt || ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
