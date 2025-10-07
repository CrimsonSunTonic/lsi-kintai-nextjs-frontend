"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserClient } from "../../api/auth/getUserClient";

export default function PrivateHome() {
  const router = useRouter();

  useEffect(() => {
    async function redirectByRole() {
      const user = await getUserClient();
      if (!user) router.push("/signin");
      else if (user.role === "ADMIN") router.push("/admin/records");
      else router.push("/user/attendance");
    }
    redirectByRole();
  }, [router]);

  return null;
}
