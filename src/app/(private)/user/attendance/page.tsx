"use client";

import { useState, useEffect } from "react";
import { Attendance } from "@/api/attendance/attendanceClient";
import { fetchAttendanceStatus } from "@/api/attendance/fetchAttendanceStatusClient";
import { handleAttendanceAction } from "@/utils/attendanceHandler";
import { notify } from "@/utils/sweetalertHelp";

type StatusKey = "checkin" | "checkout" | "lunchin" | "lunchout";

export default function AttendancePage() {
  const [record, setRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<StatusKey | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState({
    checkedIn: false,
    checkedOut: false,
    lunchIn: false,
    lunchOut: false,
  });

  // --- Real-time clock update ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Fetch attendance status ---
  const refreshStatus = async () => {
    try {
      const s = await fetchAttendanceStatus();
      setStatus(s);
    } catch {
      notify("error", "エラー", "ステータスの取得に失敗しました。");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  // --- Handle attendance action ---
  const handleAttendance = async (type: StatusKey) => {
    setLoading(true);
    setActiveButton(type);

    const result = await handleAttendanceAction(type);
    setRecord(result.record);

    if (result.success) {
      notify("success", "成功", result.message);
      await refreshStatus();
    } else {
      notify("error", "エラー", result.message);
    }

    setLoading(false);
    setActiveButton(null);
  };

  // --- Disable logic ---
  const disable = {
    checkin: loading || !status.checkedIn,
    lunchin: loading || !status.lunchIn,
    lunchout: loading || !status.lunchOut,
    checkout: loading || !status.checkedOut,
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-md w-full mt-5">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center relative overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-lg"></div>

          <div className="relative">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                勤怠システム
              </h1>
              <p className="text-gray-600">出勤・退勤の打刻を行います</p>
            </div>

            {/* Current Time */}
            <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xl font-semibold text-gray-700">
                  現在時刻:{" "}
                  {currentTime.toLocaleString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <AttendanceButton
                type="checkin"
                label="出勤"
                color="green"
                active={status.checkedIn}
                loading={loading && activeButton === "checkin"}
                disabled={disable.checkin}
                onClick={() => handleAttendance("checkin")}
              />
              <AttendanceButton
                type="lunchin"
                label="昼食入り"
                color="yellow"
                active={status.lunchIn}
                loading={loading && activeButton === "lunchin"}
                disabled={disable.lunchin}
                onClick={() => handleAttendance("lunchin")}
              />
              <AttendanceButton
                type="lunchout"
                label="昼食戻り"
                color="blue"
                active={status.lunchOut}
                loading={loading && activeButton === "lunchout"}
                disabled={disable.lunchout}
                onClick={() => handleAttendance("lunchout")}
              />
              <AttendanceButton
                type="checkout"
                label="退勤"
                color="red"
                active={status.checkedOut}
                loading={loading && activeButton === "checkout"}
                disabled={disable.checkout}
                onClick={() => handleAttendance("checkout")}
              />
            </div>

            {/* Footer Note */}
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

/* ------------------------ */
/* Reusable Button Component */
/* ------------------------ */
function AttendanceButton({
  type,
  label,
  color,
  active,
  loading,
  disabled,
  onClick,
}: {
  type: StatusKey;
  label: string;
  color: "green" | "yellow" | "blue" | "red";
  active: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const colorMap = {
    green: "from-green-500 to-emerald-600",
    yellow: "from-yellow-500 to-orange-600",
    blue: "from-blue-500 to-cyan-600",
    red: "from-red-500 to-pink-600",
  }[color];

  const activeBorder = {
    green: "border-green-500 text-green-700 bg-green-50/80 hover:bg-green-100/80",
    yellow: "border-yellow-500 text-yellow-700 bg-yellow-50/80 hover:bg-yellow-100/80",
    blue: "border-blue-500 text-blue-700 bg-blue-50/80 hover:bg-blue-100/80",
    red: "border-red-500 text-red-700 bg-red-50/80 hover:bg-red-100/80",
  }[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : active
          ? `border-2 ${activeBorder} backdrop-blur-sm`
          : `bg-gradient-to-r ${colorMap} text-white hover:brightness-110 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`
      }`}
    >
      {!disabled && !active && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      )}
      {loading ? (
        <>
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>処理中...</span>
        </>
      ) : (
        <>
          {type === "checkin" ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ) : type === "checkout" ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
