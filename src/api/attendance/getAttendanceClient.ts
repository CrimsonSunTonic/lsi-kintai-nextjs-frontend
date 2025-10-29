import { apiClient } from "@/utils/apiClient";

export interface AttendanceRecord {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  date: string;
  status: "checkin" | "checkout" | "lunchin" | "lunchout";
  latitude: number;
  longitude: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAttendanceClient(): Promise<AttendanceRecord[]> {
  const token = localStorage.getItem("access_token");
  if (!token) return [];

  try {
    const data = await apiClient(`${API_BASE}/attendance/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (err) {
    console.error("勤怠記録の取得中にエラーが発生しました:", err);
    return [];
  }
}
