const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAttendanceStatus(): Promise<{ checkedIn: boolean; checkedOut: boolean }> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("アクセストークンが見つかりません");

  try {
    const res = await fetch(`${API_BASE}/attendance/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`ステータスの取得に失敗しました: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("勤怠ステータスの取得中にエラーが発生しました:", err);
    throw err;
  }
}
