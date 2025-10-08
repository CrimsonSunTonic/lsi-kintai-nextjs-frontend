const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAttendanceMonthlyClient(
  userId: number,
  month: number,
  year: number
) {
  const token = localStorage.getItem("access_token");

  const formData = new URLSearchParams();
  formData.append("userId", String(userId));
  formData.append("month", String(month));
  formData.append("year", String(year));

  const res = await fetch(`${API_BASE}/attendance/monthly`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
}
