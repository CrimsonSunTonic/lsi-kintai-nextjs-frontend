const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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

    if (!res.ok) {
      console.error("勤怠の送信に失敗しました");
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("勤怠の送信中にエラーが発生しました:", err);
    return null;
  }
}
