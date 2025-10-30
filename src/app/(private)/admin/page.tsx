"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );

  const handleEmployeeManagement = () => {
    router.push("/admin/dashboard");
  };

  const handleAttendanceRecords = () => {
    router.push("/admin/records");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 transform transition-all duration-300">
          {/* Welcome Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Welcome Text */}
          <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
            管理ページへようこそ！
          </h1>

          {/* User Greeting */}
          {user && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 inline-block mb-8">
              <p className="text-2xl font-semibold text-gray-800">
                <span className="text-blue-600">{user.firstname} {user.lastname}</span> さん
              </p>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            以下の管理機能から選択してください。
            社員管理、勤怠記録の確認など、管理者権限で利用可能な機能をご利用いただけます。
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            {/* Employee Management Card */}
            <button
              onClick={handleEmployeeManagement}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center border border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                社員管理
              </h3>
              <p className="text-gray-600 mb-4">従業員情報の登録・編集</p>
              <div className="text-blue-600 font-medium text-sm flex items-center justify-center space-x-1 group-hover:space-x-2 transition-all duration-300">
                <span>アクセスする</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Attendance Records Card */}
            <button
              onClick={handleAttendanceRecords}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center border border-green-200 hover:border-green-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                勤怠記録
              </h3>
              <p className="text-gray-600 mb-4">出退勤履歴の確認</p>
              <div className="text-green-600 font-medium text-sm flex items-center justify-center space-x-1 group-hover:space-x-2 transition-all duration-300">
                <span>アクセスする</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Getting Started Tips */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              はじめに
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>社員管理から従業員の登録・編集ができます</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>勤怠記録で従業員の出退勤を確認できます</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Excel形式でのデータ出力が可能です</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>管理者権限で全ての機能を利用できます</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}