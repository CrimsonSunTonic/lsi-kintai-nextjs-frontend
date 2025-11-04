"use client";

import { useUserAuth } from "@/hooks/useUserAuth";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">読み込み中...</p>
        </div>
      </div>
    );

  const handleAttendanceRegistration = () => {
    router.push("/user/attendance");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center w-full mt-5">
        {/* Welcome Card with Glass Effect */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 hover:shadow-3xl relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl opacity-20 blur-lg"></div>
          
          <div className="relative">
            {/* Welcome Icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Welcome Text */}
            <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
              ユーザーページへようこそ！
            </h1>

            {/* User Greeting */}
            {user && (
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl p-6 inline-block mb-8 border border-white/30">
                <p className="text-2xl font-semibold text-gray-800">
                  <span className="text-green-600">{user.firstname} {user.lastname}</span> さん
                </p>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              勤怠管理システムをご利用いただきありがとうございます。
              出勤・退勤の登録や勤怠状況の確認ができます。
            </p>

            {/* Main Action Card */}
            <div className="max-w-md mx-auto">
              <button
                onClick={handleAttendanceRegistration}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/30 hover:border-green-400/50 hover:shadow-2xl hover:scale-105 group cursor-pointer w-full relative overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-10 blur-sm group-hover:opacity-20"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-700">
                    勤怠登録
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">出勤・退勤の打刻を行います</p>
                  <div className="text-green-600 font-semibold text-lg flex items-center justify-center space-x-2 group-hover:space-x-3">
                    <span>今すぐ開始</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Getting Started Tips */}
            <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ご利用ガイド
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>「勤怠登録」から出勤・退勤の打刻ができます</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>位置情報を使用して正確な打刻を行います</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>過去の勤怠記録を確認できます</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>プロファイルで個人情報を管理できます</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}