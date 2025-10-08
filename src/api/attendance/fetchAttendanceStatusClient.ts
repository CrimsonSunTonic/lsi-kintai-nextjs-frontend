const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAttendanceStatus(): Promise<{ checkedIn: boolean; checkedOut: boolean }> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const res = await fetch(`${API_BASE}/attendance/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch status: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching attendance status:", err);
    throw err;
  }
}
