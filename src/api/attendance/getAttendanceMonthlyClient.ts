export async function getAttendanceMonthlyClient(
  userId: number,
  month: number,
  year: number
) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(
    `http://localhost:4000/attendance/monthly?userId=${userId}&month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
}
