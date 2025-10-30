"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserClient, UserData } from "../../api/auth/getUserClient";
import AppHeader from "@/components/AppHeader";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {user && <AppHeader user={user} />}
      <main className="pt-16"> {/* Add padding top to account for fixed header */}
        {children}
      </main>
    </div>
  );
}