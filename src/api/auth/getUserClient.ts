import { apiClient } from "@/utils/apiClient";

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
    const data = await apiClient(`${API_BASE}/user/me`, {});

    return data;
  } catch (err) {
    console.error("ユーザー情報の取得に失敗しました:", err);
    return null;
  }
}
