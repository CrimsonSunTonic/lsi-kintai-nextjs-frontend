export interface SignupData {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function signup(
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<SignupData> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstname, lastname }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "新規登録に失敗しました"
    );
  }

  return data.user;
}
