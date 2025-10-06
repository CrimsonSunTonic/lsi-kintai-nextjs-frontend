export interface UserData {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

const API_BASE = "http://localhost:4000";

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Login failed"
    );
  }

  // save token
  localStorage.setItem("access_token", data.access_token);

  return data.access_token;
}

export async function getUserMe(token: string): Promise<UserData> {
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get user info");
  }

  return data;
}
