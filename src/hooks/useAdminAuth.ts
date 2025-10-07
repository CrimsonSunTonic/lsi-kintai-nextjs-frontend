"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserClient } from "@/api/auth/getUserClient";
import type { UserData } from "@/api/auth/getUserClient";

export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.replace("/signin");
        return;
      }

      const userData = await getUserClient();
      if (!userData) {
        localStorage.removeItem("access_token");
        router.replace("/signin");
        return;
      }

      // Redirect if not admin
      if (userData.role !== "ADMIN") {
        router.replace("/user/attendance");
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    checkAccess();
  }, [router]);

  return { user, loading };
}
