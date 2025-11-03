"use client";

import { useState, useEffect } from "react";
import { Attendance } from "@/api/attendance/attendanceClient";
import { fetchAttendanceStatus } from "@/api/attendance/fetchAttendanceStatusClient";
import { handleAttendanceAction } from "@/utils/attendanceHandler";
import { notify } from "@/utils/sweetalertHelp";

export default function AttendancePage() {
  const [record, setRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<
    "checkin" | "checkout" | "lunchin" | "lunchout" | null
  >(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [lunchIn, setLunchIn] = useState(false);
  const [lunchOut, setLunchOut] = useState(false);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceStatus()
      .then((status) => {
        setCheckedIn(status.checkedIn);
        setCheckedOut(status.checkedOut);
        setLunchIn(status.lunchIn);
        setLunchOut(status.lunchOut);
      })
      .catch(() => {
        notify("error", "エラー", "ステータスの取得に失敗しました。");
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleAttendance = async (
    status: "checkin" | "checkout" | "lunchin" | "lunchout"
  ) => {
    setLoading(true);
    setActiveButton(status);

    const result = await handleAttendanceAction(status);
    setRecord(result.record);

    if (result.success) {
      notify("success", "成功", result.message);
      switch (status) {
        case "checkin":
          setCheckedIn(true);
          break;
        case "checkout":
          setCheckedOut(true);
          break;
        case "lunchin":
          setLunchIn(true);
          break;
        case "lunchout":
          setLunchOut(true);
          break;
      }
    } else {
      notify("error", "エラー", result.message);
    }

    setLoading(false);
    setActiveButton(null);
  };

  // --- Simplified logic flags ---
  const isWorking = checkedIn && !checkedOut;
  const isLunching = lunchIn && !lunchOut;
  const isFinished = checkedOut;

  // --- Disable logic (cleaner & readable) ---
  const disableCheckIn = loading || checkedIn || isWorking || isLunching || isFinished;
  const disableLunchIn = loading || !isWorking || isLunching || lunchIn;
  const disableLunchOut = loading || !lunchIn || lunchOut || isFinished;
  const disableCheckOut = loading || !checkedIn || isLunching || isFinished;

  if (initialLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">読み込み中...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-md w-full mt-5">
        {/* Main Card with Glass Effect */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-lg animate-pulse"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                勤怠システム
              </h1>
              <p className="text-gray-600">出勤・退勤の打刻を行います</p>
            </div>

            {/* Current Time Display */}
            <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">
                  現在時刻: {currentTime.toLocaleString('ja-JP', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Attendance Buttons */}
            <div className="space-y-4">
              {/* Check-in Button */}
              <button
                onClick={() => handleAttendance("checkin")}
                disabled={disableCheckIn}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
                  disableCheckIn
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : checkedIn
                    ? "border-2 border-green-500 text-green-700 bg-green-50/80 hover:bg-green-100/80 backdrop-blur-sm"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!disableCheckIn && !checkedIn && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
                {loading && activeButton === "checkin" ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>出勤</span>
                  </>
                )}
              </button>

              {/* Lunch-in Button */}
              <button
                onClick={() => handleAttendance("lunchin")}
                disabled={disableLunchIn}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
                  disableLunchIn
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : lunchIn
                    ? "border-2 border-yellow-500 text-yellow-700 bg-yellow-50/80 hover:bg-yellow-100/80 backdrop-blur-sm"
                    : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!disableLunchIn && !lunchIn && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
                {loading && activeButton === "lunchin" ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>昼食入り</span>
                  </>
                )}
              </button>

              {/* Lunch-out Button */}
              <button
                onClick={() => handleAttendance("lunchout")}
                disabled={disableLunchOut}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
                  disableLunchOut
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : lunchOut
                    ? "border-2 border-blue-500 text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 backdrop-blur-sm"
                    : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!disableLunchOut && !lunchOut && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
                {loading && activeButton === "lunchout" ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>昼食戻り</span>
                  </>
                )}
              </button>

              {/* Check-out Button */}
              <button
                onClick={() => handleAttendance("checkout")}
                disabled={disableCheckOut}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
                  disableCheckOut
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : checkedOut
                    ? "border-2 border-red-500 text-red-700 bg-red-50/80 hover:bg-red-100/80 backdrop-blur-sm"
                    : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {!disableCheckOut && !checkedOut && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
                {loading && activeButton === "checkout" ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>処理中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <span>退勤</span>
                  </>
                )}
              </button>
            </div>

            {/* Current Status*/}
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">現在のステータス</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                  checkedIn ? 'bg-green-100/80 text-green-800 border border-green-200' : 'bg-gray-100/80 text-gray-600 border border-gray-200'
                }`}>
                  出勤: {checkedIn ? '済' : '未'}
                </div>
                <div className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                  lunchIn ? 'bg-yellow-100/80 text-yellow-800 border border-yellow-200' : 'bg-gray-100/80 text-gray-600 border border-gray-200'
                }`}>
                  昼食入: {lunchIn ? '済' : '未'}
                </div>
                <div className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                  lunchOut ? 'bg-blue-100/80 text-blue-800 border border-blue-200' : 'bg-gray-100/80 text-gray-600 border border-gray-200'
                }`}>
                  昼食戻: {lunchOut ? '済' : '未'}
                </div>
                <div className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                  checkedOut ? 'bg-red-100/80 text-red-800 border border-red-200' : 'bg-gray-100/80 text-gray-600 border border-gray-200'
                }`}>
                  退勤: {checkedOut ? '済' : '未'}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>※ 位置情報を使用して正確な打刻を行います</p>
              <p>※ 各操作は一度のみ実行できます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}