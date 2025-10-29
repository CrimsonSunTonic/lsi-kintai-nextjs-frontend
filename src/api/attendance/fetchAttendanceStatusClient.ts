import { apiClient } from "@/utils/apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAttendanceStatus(): Promise<{ checkedIn: boolean; checkedOut: boolean; lunchIn: boolean; lunchOut: boolean }> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("アクセストークンが見つかりません");

  try {
    const data = await apiClient(`${API_BASE}/attendance/status`, {});

    return data;
  } catch (err) {
    console.error("勤怠ステータスの取得中にエラーが発生しました:", err);
    throw err;
  }
}
