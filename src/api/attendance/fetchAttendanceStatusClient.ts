const API_BASE = "http://localhost:4000";

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
