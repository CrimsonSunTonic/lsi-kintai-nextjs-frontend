const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAllUsersClient() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_BASE}/user/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
