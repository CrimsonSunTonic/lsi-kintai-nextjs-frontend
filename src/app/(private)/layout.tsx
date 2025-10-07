"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserClient, UserData } from "../../api/auth/getUserClient";
import AppHeader from "@/components/AppHeader";
import { CircularProgress, Box } from "@mui/material";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const userData = await getUserClient();
      if (!userData) router.push("/signin");
      else setUser(userData);
      setLoading(false);
    }
    loadUser();
  }, [router]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {user && <AppHeader user={user} />}
      <Box sx={{ mt: 8 }}>{children}</Box>
    </>
  );
}
