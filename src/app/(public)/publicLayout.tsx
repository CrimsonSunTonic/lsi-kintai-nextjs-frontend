"use client"

import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen animated-gradient-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 background-animate-morph"></div>
        
        {/* Floating Shapes */}
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow animation-delay-4000"></div>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>

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

export default PublicLayout;