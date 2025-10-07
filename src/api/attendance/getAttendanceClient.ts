export interface AttendanceRecord {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  date: string;
  status: "checkin" | "checkout";
  latitude: number;
  longitude: number;
}

const API_BASE = "http://localhost:4000";

export async function getAttendanceClient(): Promise<AttendanceRecord[]> {
  const token = localStorage.getItem("access_token");
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/attendance/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch attendance records");

    return await res.json();
  } catch (err) {
    console.error("Error fetching attendance records:", err);
    return [];
  }
}
