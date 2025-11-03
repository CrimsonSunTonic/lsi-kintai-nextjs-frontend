"use client";

import { useEffect, useState } from "react";
import { getAttendanceMonthlyClient } from "@/api/attendance/getAttendanceMonthlyClient";
import { getAllUsersClient } from "@/api/user/getAllUsersClient";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AttendanceTable from "./components/AttendanceTable";
import MapDialog from "./components/MapDialog";
import { exportAttendanceExcel } from "./utils/exportAttendanceExcel";
import { AttendanceRecord, User, GroupedRecord } from "./utils/attendanceUtils";

export default function UserRecordsPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const [records, setRecords] = useState<GroupedRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // 🗺️ Map display state
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    label?: string;
    time?: string;
  } | null>(null);

  const handleShowMap = (lat: number, lng: number, label?: string, time?: string) => {
    setSelectedLocation({ lat, lng, label, time });
  };

  // ✅ Fetch all users
  useEffect(() => {
    if (authLoading || !user) return;
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersClient();
        setUsers(data);
      } catch {
        setError("社員の取得に失敗しました。");
      }
    };
    fetchUsers();
  }, [authLoading, user]);

  // ✅ Generate all days in the month
  const generateAllDays = (year: number, month: number): GroupedRecord[] => {
    const days: GroupedRecord[] = [];
    const date = new Date(year, month - 1, 1);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    while (date.getMonth() + 1 === month) {
      const weekday = weekdays[date.getDay()];
      days.push({ day: date.getDate(), weekday });
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  // ✅ Fetch and merge attendance
  const handleFetch = async () => {
    if (!selectedUser) {
      setError("社員を選択してください。");
      return;
    }

    setError(null);
    setDataLoading(true);

    try {
      const data: AttendanceRecord[] = await getAttendanceMonthlyClient(selectedUser, month, year);

      const grouped: Record<
        string,
        { checkin?: string; checkout?: string; checkinLoc?: [number, number]; checkoutLoc?: [number, number] }
      > = {};

      data.forEach((rec) => {
        const dateKey = rec.date.split("T")[0];
        const time = rec.date.split("T")[1].slice(0, 5);

        if (!grouped[dateKey]) grouped[dateKey] = {};

        if (rec.status === "checkin" && !grouped[dateKey].checkin) {
          grouped[dateKey].checkin = time;
          grouped[dateKey].checkinLoc = [rec.latitude, rec.longitude];
        }
        if (rec.status === "checkout") {
          grouped[dateKey].checkout = time;
          grouped[dateKey].checkoutLoc = [rec.latitude, rec.longitude];
        }
      });

      const allDays = generateAllDays(year, month);
      const fullRecords = allDays.map((d) => {
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
        const dayData = grouped[dateKey] || {};
        return {
          day: d.day,
          weekday: d.weekday,
          checkin: dayData.checkin || "",
          checkout: dayData.checkout || "",
          checkinLoc: dayData.checkinLoc,
          checkoutLoc: dayData.checkoutLoc,
        };
      });

      setRecords(fullRecords);
    } catch {
      setError("勤怠記録の取得に失敗しました。");
    } finally {
      setDataLoading(false);
    }
  };

  // ✅ Export Excel
  const handleExportExcel = () => {
    if (records.length === 0 || !selectedUser) return;
    exportAttendanceExcel(records, users, selectedUser, year, month);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">管理者アクセスを確認中…</p>
        </div>
      </div>
    );
  }

  const selectedUserName =
    users.find((u) => u.id === selectedUser)?.firstname +
      " " +
      users.find((u) => u.id === selectedUser)?.lastname || "";

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header with Glass Effect */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden mt-5">
        {/* Background Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-lg"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">勤怠記録管理</h1>
                <p className="text-gray-600 text-lg">
                  従業員の勤怠記録を確認および管理します
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                管理画面
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{users.length}</div>
              <div className="text-gray-500 text-sm">登録社員数</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls with Glass Effect */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                社員選択
              </label>
              <div className="relative">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(Number(e.target.value))}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/80 text-gray-800 appearance-none cursor-pointer hover:border-purple-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                >
                  <option value="" className="text-gray-400">社員を選択</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="text-gray-800 py-2">
                      {u.firstname} {u.lastname}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-purple-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Month Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                月
              </label>
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/80 text-gray-800 appearance-none cursor-pointer hover:border-blue-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m} className="text-gray-800 py-2">
                      {m}月
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-blue-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Year Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年
              </label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/80 text-gray-800 appearance-none cursor-pointer hover:border-green-300 shadow-sm hover:shadow-md backdrop-blur-sm"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y} className="text-gray-800 py-2">
                      {y}年
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-green-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons remain the same */}
          <div className="flex gap-3">
            <button
              onClick={handleFetch}
              disabled={dataLoading || !selectedUser}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {dataLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>確認</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportExcel}
              disabled={records.length === 0}
              className="px-6 py-3 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Excel出力</span>
            </button>
          </div>
        </div>
      </div>


      {/* Error Alert */}
      {error && (
        <div className="bg-yellow-50/80 backdrop-blur-sm border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-6 transition-all duration-300">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {!error && records.length > 0 && (
        <div className="space-y-6">
          {/* Header with Glass Effect */}
          <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 relative z-10">
              {selectedUserName} {year}年{month}月の勤務表
            </h2>
          </div>

          {/* Table Container with Glass Effect */}
          <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
            
            <div className="relative z-10">
              <AttendanceTable records={records} onShowMap={handleShowMap} />
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && records.length === 0 && !dataLoading && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">勤怠記録がありません</h3>
            <p className="text-gray-600 mb-6">
              社員と期間を選択して「確認」ボタンをクリックすると、勤怠記録が表示されます。
            </p>
          </div>
        </div>
      )}

      {/* Map Dialog */}
      <MapDialog location={selectedLocation} onClose={() => setSelectedLocation(null)} />
    </div>
  );
}