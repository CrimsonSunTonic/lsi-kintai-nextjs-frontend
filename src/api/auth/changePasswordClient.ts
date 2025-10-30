// src/api/auth/changePasswordClient.ts
import { apiClient } from "@/utils/apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export async function changePasswordClient(
  changePasswordData: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  const data = await apiClient(`${API_BASE}/auth/change-password`, {
    method: "POST",
    body: JSON.stringify(changePasswordData),
  });

  return data;
}