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
    <div className="min-h-screen animated-gradient-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 background-animate-morph"></div>
        
        {/* Floating Shapes */}
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow animation-delay-4000"></div>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      </div>

      {user && <AppHeader user={user} />}
      <main className="pt-16 relative z-10 min-h-[calc(100vh-4rem)] p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Add styles for animations */}
      <style jsx global>{`
        @keyframes gradient-morph {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animated-gradient-background {
          position: relative;
          background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #6366f1, #06b6d4);
          background-size: 400% 400%;
          animation: gradient-morph 15s ease infinite;
        }

        .background-animate-morph {
          background-size: 400% 400%;
          animation: gradient-morph 20s ease infinite;
        }

        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}