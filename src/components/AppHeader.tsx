"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserData } from "@/api/auth/getUserClient";
import Image from "next/image";

const AppHeader = ({ user }: { user: UserData }) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    router.push("/signin");
  };

  const handleLogoClick = () => {
    if (user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const menuItems =
    user.role === "ADMIN"
      ? [ 
          { label: "社員管理", path: "/admin/dashboard", icon: "👥" }, 
          { label: "勤怠履歴", path: "/admin/records", icon: "📊" }
        ]
      : [{ label: "勤怠登録", path: "/user/attendance", icon: "⏰" }];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/10 backdrop-blur-2xl shadow-2xl border-b border-white/20" 
        : "bg-white/5 backdrop-blur-xl shadow-lg border-b border-white/10"
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/80 via-purple-500/80 to-indigo-600/80 background-animate-morph"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300/30 rounded-full mix-blend-overlay filter blur-xl animate-float-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300/30 rounded-full mix-blend-overlay filter blur-xl animate-float-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-pink-300/20 rounded-full mix-blend-overlay filter blur-xl animate-float-slow animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="w-10 h-10 relative bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 p-1.5 group-hover:bg-white/30 group-hover:border-white/40 transition-all duration-300 shadow-lg">
                    <Image
                      src="/logo.png"
                      alt="LSI Logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                      priority
                    />
                  </div>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-white/90 transition-all duration-300 drop-shadow-lg bg-gradient-to-r from-white to-white/90 bg-clip-text">
                  LSI勤怠システム
                </span>
              </button>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className="relative px-4 py-2 text-white/90 hover:text-white font-medium rounded-xl hover:bg-white/15 transition-all duration-300 group overflow-hidden backdrop-blur-sm border border-transparent hover:border-white/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 bg-white/15 backdrop-blur-lg rounded-xl px-4 py-2 hover:bg-white/25 border border-white/25 transition-all duration-300 cursor-pointer group hover:scale-105 shadow-lg"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-white to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm relative z-10 shadow-inner">
                    {user.firstname.charAt(0)}
                  </div>
                </div>
                <span className="text-white font-medium drop-shadow-sm">
                  {user.firstname} {user.lastname}
                </span>
                <svg 
                  className={`w-4 h-4 text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-64 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 py-2 animate-fadeIn z-50 overflow-hidden">
                  {/* Background Gradient with Better Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/95 to-purple-50/95 rounded-2xl"></div>
                  
                  {/* Subtle Border Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-sm"></div>
                  
                  <div className="relative">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200/60 relative z-10">
                      <p className="text-sm font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                      <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                      <div className="absolute top-0 right-0 mt-2 mr-3">
                        <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
                          {user.role === "ADMIN" ? "管理者" : "ユーザー"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Change Password */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/change-password");
                      }}
                      className="relative w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 font-medium flex items-center space-x-3 group z-10"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200 shadow-sm">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span>パスワード変更</span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="relative w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50/80 transition-all duration-300 font-medium flex items-center space-x-3 group border-t border-gray-200/60 z-10"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-red-200 shadow-sm">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span>ログアウト</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute left-0 top-1 w-6 h-0.5 bg-gray-700 rounded-full ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-gray-700 rounded-full ${open ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 top-5 w-6 h-0.5 bg-gray-700 rounded-full ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/90 backdrop-blur-2xl border-b border-white/40 shadow-2xl animate-slideDown overflow-hidden">
          <div className="relative px-4 py-3 space-y-3 z-10">
            {/* User Info */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-xl border border-white/40 shadow-sm">
              <p className="font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
              <p className="text-sm text-gray-700 mt-1">{user.email}</p>
              <div className="mt-2">
                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full shadow-sm">
                  {user.role === "ADMIN" ? "管理者" : "ユーザー"}
                </span>
              </div>
            </div>

            {/* Home Link */}
            <button
              onClick={() => {
                setOpen(false);
                handleLogoClick();
              }}
              className="w-full text-left px-4 py-3 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium text-lg flex items-center space-x-3 border border-gray-200 bg-white shadow-sm"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span>ホーム</span>
            </button>

            {/* Menu Items */}
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  router.push(item.path);
                }}
                className="w-full text-left px-4 py-3 text-gray-800 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 font-medium text-lg flex items-center space-x-3 border border-gray-200 bg-white shadow-sm"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Change Password */}
            <button
              onClick={() => {
                setOpen(false);
                router.push("/change-password");
              }}
              className="w-full text-left px-4 py-3 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium text-lg flex items-center space-x-3 border border-gray-200 bg-white shadow-sm"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>パスワード変更</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-3 text-red-700 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 font-medium text-lg flex items-center space-x-3 border border-red-300 bg-red-50 shadow-sm"
            >
              <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      )}


      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
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
    </header>
  );
};

export default AppHeader;