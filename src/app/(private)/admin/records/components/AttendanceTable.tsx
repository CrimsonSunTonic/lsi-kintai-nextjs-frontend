"use client";

import React from "react";
import { calcWorkTimes } from "../utils/attendanceUtils";

export interface GroupedRecord {
  day: number;
  weekday: string;
  checkin?: string;
  checkout?: string;
  checkinLoc?: [number, number];
  checkoutLoc?: [number, number];
}

interface AttendanceTableProps {
  records: GroupedRecord[];
  onShowMap: (lat: number, lng: number, label?: string, time?: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onShowMap }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">日付</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">曜日</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">出勤時刻</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">退勤時刻</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">実働時間</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">普通残業</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">深夜残業</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {records.map((rec) => {
              const { actual, normalOt, midnightOt } = calcWorkTimes(
                rec.checkin || "",
                rec.checkout || "",
                rec.weekday
              );

              let bgColor = "bg-white";
              let textColor = "text-gray-900";
              let dayBgColor = "";

              if (rec.weekday === "土") {
                bgColor = "bg-blue-50";
                textColor = "text-blue-900";
                dayBgColor = "bg-blue-100";
              } else if (rec.weekday === "日") {
                bgColor = "bg-red-50";
                textColor = "text-red-900";
                dayBgColor = "bg-red-100";
              }

              return (
                <tr key={rec.day} className={`${bgColor} hover:bg-gray-50 transition-colors duration-200`}>
                  {/* Date */}
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textColor}`}>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${dayBgColor}`}>
                      {rec.day}
                    </span>
                  </td>

                  {/* Weekday */}
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textColor}`}>
                    {rec.weekday}
                  </td>

                  {/* Check-in Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rec.checkin ? (
                      <button
                        onClick={() =>
                          rec.checkinLoc &&
                          onShowMap(rec.checkinLoc[0], rec.checkinLoc[1], "出勤位置", rec.checkin)
                        }
                        className={`font-semibold transition-all duration-200 hover:scale-105 ${
                          rec.checkinLoc 
                            ? "text-green-600 hover:text-green-800 underline cursor-pointer" 
                            : "text-gray-600 cursor-default"
                        }`}
                      >
                        {rec.checkin}
                        {rec.checkinLoc && (
                          <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-400 font-semibold">-</span>
                    )}
                  </td>

                  {/* Check-out Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rec.checkout ? (
                      <button
                        onClick={() =>
                          rec.checkoutLoc &&
                          onShowMap(rec.checkoutLoc[0], rec.checkoutLoc[1], "退勤位置", rec.checkout)
                        }
                        className={`font-semibold transition-all duration-200 hover:scale-105 ${
                          rec.checkoutLoc 
                            ? "text-red-600 hover:text-red-800 underline cursor-pointer" 
                            : "text-gray-600 cursor-default"
                        }`}
                      >
                        {rec.checkout}
                        {rec.checkoutLoc && (
                          <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-400 font-semibold">-</span>
                    )}
                  </td>

                  {/* Actual Work Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {actual || "-"}
                  </td>

                  {/* Normal Overtime */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                    {normalOt || "-"}
                  </td>

                  {/* Midnight Overtime */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                    {midnightOt || "-"}
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
          <span className="text-gray-600">
            全 {records.length} 日間の勤怠記録
          </span>
          <div className="flex space-x-6 text-gray-600">
            <span>出勤: {records.filter(r => r.checkin).length} 日</span>
            <span>退勤: {records.filter(r => r.checkout).length} 日</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;