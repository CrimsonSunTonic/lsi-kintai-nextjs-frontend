"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserClient } from "../api/auth/getUserClient";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // No token → redirect to signin
      if (!token) {
        router.replace("/signin");
        return;
      }

      // Has token → verify it with backend
      const user = await getUserClient();
      if (user) {
        // Redirect based on role
        if (user.role === "ADMIN") {
          router.replace("/admin/");
        } else {
          router.replace("/user/attendance");
        }
      } else {
        // invalid token → redirect to signin
        localStorage.removeItem("access_token");
        router.replace("/signin");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl font-semibold text-blue-700">認証確認中...</p>
    </div>
  );
}