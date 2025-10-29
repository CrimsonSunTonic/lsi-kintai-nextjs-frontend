import { apiClient } from "@/utils/apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface Attendance {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  date: string;
  status: "checkin" | "checkout" | "lunchin" | "lunchout";
  latitude: number;
  longitude: number;
}

export async function sendAttendance(
  status: "checkin" | "checkout" | "lunchin" | "lunchout",
  latitude: number,
  longitude: number
): Promise<Attendance | null> {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const data = await apiClient(`${API_BASE}/attendance`, {
      method: "POST",
      body: JSON.stringify({ status, latitude, longitude }),
    });

    return data;
  } catch (err) {
    console.error("勤怠の送信中にエラーが発生しました:", err);
    return null;
  }
}
