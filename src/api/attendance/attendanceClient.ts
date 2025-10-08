const API_BASE = "http://localhost:4000";

export interface Attendance {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  date: string;
  status: "checkin" | "checkout";
  latitude: number;
  longitude: number;
}

export async function sendAttendance(
  status: "checkin" | "checkout",
  latitude: number,
  longitude: number
): Promise<Attendance | null> {
  const token = localStorage.getItem("access_token");
    if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, latitude, longitude }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to send attendance:", err);
    return null;
  }
}
