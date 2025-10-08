export interface UserData {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
        : data.message || "ログインに失敗しました"
    );
  }

  // save token
  localStorage.setItem("access_token", data.access_token);

  return data.access_token;
}
