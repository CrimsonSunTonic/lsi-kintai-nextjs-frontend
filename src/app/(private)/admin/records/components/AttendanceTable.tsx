"use client";

import React from "react";
import { GroupedRecord, AttendanceEvent } from "../utils/attendanceUtils";

interface AttendanceTableProps {
  records: GroupedRecord[];
  onShowMap: (lat: number, lng: number, label?: string, time?: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onShowMap }) => {
  // 🧩 helper hiển thị nhiều times + location click
  const renderTimes = (
    events?: AttendanceEvent[],
    label?: string,
    color?: string
  ) => {
    if (!events || events.length === 0) {
      return <span className="text-gray-400 font-semibold">-</span>;
    }

    return (
      <div className="flex flex-col gap-2">
        {events.map((ev, i) => (
          <button
            key={i}
            onClick={() => onShowMap(ev.loc[0], ev.loc[1], label, ev.time)}
            className={`font-semibold transition-all duration-200 text-sm w-fit ${color} underline hover:scale-105 cursor-pointer`}
          >
            {ev.time}
            <svg
              className="w-3.5 h-3.5 inline ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">日付</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">曜日</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">出勤</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">昼休み入り</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">昼休み戻り</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">退勤</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">実働時間</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {records.map((rec) => {
              const { data } = rec;

              let bgColor = "bg-white";
              let textColor = "text-gray-800";
              let dayBgColor = "";

              if (rec.weekday === "土") {
                bgColor = "bg-blue-50";
                textColor = "text-blue-800";
                dayBgColor = "bg-blue-100";
              } else if (rec.weekday === "日") {
                bgColor = "bg-red-50";
                textColor = "text-red-800";
                dayBgColor = "bg-red-100";
              }

              return (
                <tr
                  key={rec.day}
                  className={`${bgColor} hover:bg-gray-50 transition-colors duration-200`}
                >
                  {/* 日付 */}
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textColor}`}>
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${dayBgColor} ${textColor}`}
                    >
                      {rec.day}
                    </span>
                  </td>

                  {/* 曜日 */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textColor}`}
                  >
                    {rec.weekday}
                  </td>

                  {/* 出勤 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderTimes(data?.checkin, "出勤位置", "text-green-700")}
                  </td>

                  {/* 昼休み入り */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderTimes(data?.lunchin, "昼休み入り位置", "text-blue-700")}
                  </td>

                  {/* 昼休み戻り */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderTimes(data?.lunchout, "昼休み戻り位置", "text-cyan-700")}
                  </td>

                  {/* 退勤 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderTimes(data?.checkout, "退勤位置", "text-red-700")}
                  </td>

                  {/* 実働時間 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {data?.workingHours != null && data?.workingHours != null ? `${data.workingHours.toFixed(1)}` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">全 {records.length} 日間の勤怠記録</span>
          <div className="flex space-x-6 text-gray-600">
            <span>
              出勤:{" "}
              {records.filter((r) => r.data?.checkin && r.data.checkin.length > 0).length} 日
            </span>
            <span>
              退勤:{" "}
              {records.filter((r) => r.data?.checkout && r.data.checkout.length > 0).length} 日
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
