export interface UserData {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: "ADMIN" | "USER";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getUserClient(): Promise<UserData | null> {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
}
