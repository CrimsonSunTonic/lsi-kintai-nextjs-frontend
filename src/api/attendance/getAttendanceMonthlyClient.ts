import { apiClient } from "@/utils/apiClient";
import { header } from "framer-motion/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAttendanceMonthlyClient(
  userId: number,
  month: number,
  year: number
) {
  const token = localStorage.getItem("access_token");

  const formData = new URLSearchParams();
  formData.append("userId", String(userId));
  formData.append("month", String(month));
  formData.append("year", String(year));

  const data = await apiClient(`${API_BASE}/attendance/monthly`, {
    method: "POST",
    body: formData.toString(),
  }, "application/x-www-form-urlencoded");

  console.log(data);
  

  return data;
}
