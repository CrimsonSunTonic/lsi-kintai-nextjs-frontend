import { cp } from "fs";

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
  console.log("check getToken >> ",localStorage.getItem("access_token"));
  return localStorage.getItem("access_token");
}

export async function getAllUsersClient(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  console.log("check getAllUsersClient res >> ",res);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUserClient(data: any) {
  console.log("check createUserClient data >> ",data);
  const res = await fetch(`${API_BASE}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function updateUserClient(id: number, data: UpdateUser) {
  console.log("check updateUserClient data >> ",data);
  const res = await fetch(`${API_BASE}/admin/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteUserClient(id: number) {
  console.log("check deleteUserClient id >> ",id);
  const res = await fetch(`${API_BASE}/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
