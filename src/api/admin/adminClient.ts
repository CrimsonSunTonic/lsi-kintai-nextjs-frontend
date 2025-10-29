import { apiClient } from "@/utils/apiClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUser {
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  password?: string;
}

function getToken() {
  return localStorage.getItem("access_token");
}

export async function getAllUsersClient(): Promise<User[]> {
  const data = await apiClient(`${API_BASE}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
}

export async function createUserClient(data_input: any) {
  const data = await apiClient(`${API_BASE}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data_input),
  });
  return data;
}

export async function updateUserClient(id: number, data_input: UpdateUser) {
  const data = await apiClient(`${API_BASE}/admin/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data_input),
  });
  return data;
}

export async function deleteUserClient(id: number) {
  console.log("check deleteUserClient id >> ",id);
  const data = await apiClient(`${API_BASE}/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
}
