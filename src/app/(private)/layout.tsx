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
      <div className="min-h-screen flex items-center justify-center animated-gradient-background">
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">読み込み中...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600"></div>
        
        {/* Floating Shapes */}
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      </div>

      {user && <AppHeader user={user} />}
      <main className="pt-16 relative z-10 min-h-[calc(100vh-4rem)] p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}