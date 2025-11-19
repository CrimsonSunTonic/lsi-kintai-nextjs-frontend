"use client";

import React from "react";
import { GroupedRecord, AttendanceEvent } from "../utils/attendanceUtils";

interface AttendanceTableProps {
  records: GroupedRecord[];
  onShowMap: (lat: number, lng: number, label?: string, time?: string) => void;
  onEditRecord: (
    date: string, 
    type: 'checkin' | 'checkout' | 'lunchin' | 'lunchout', 
    event?: AttendanceEvent,
    dayData?: any
  ) => void;
  onAddRecord: (
    date: string, 
    type: 'checkin' | 'checkout' | 'lunchin' | 'lunchout',
    dayData?: any
  ) => void;
  onDeleteDay: (date: string) => void;
  editMode: 'view' | 'add' | 'edit' | 'delete';
  year: number;
  month: number;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  records, 
  onShowMap, 
  onEditRecord,
  onAddRecord,
  onDeleteDay,
  editMode,
  year,
  month
}) => {
  const getEventTypeLabel = (type: 'checkin' | 'checkout' | 'lunchin' | 'lunchout') => {
    switch (type) {
      case 'checkin': return '出勤';
      case 'checkout': return '退勤';
      case 'lunchin': return 'ランチ（行く）';
      case 'lunchout': return 'ランチ（戻る）';
      default: return '';
    }
  };

  const getEventTypeColor = (type: 'checkin' | 'checkout' | 'lunchin' | 'lunchout') => {
    switch (type) {
      case 'checkin': return 'text-green-700';
      case 'checkout': return 'text-red-700';
      case 'lunchin': return 'text-blue-700';
      case 'lunchout': return 'text-cyan-700';
      default: return 'text-gray-700';
    }
  };

  const shouldShowAddButton = (
    type: 'checkin' | 'checkout', 
    events?: AttendanceEvent[],
    oppositeEvents?: AttendanceEvent[]
  ) => {
    if (type === 'checkin') {
      // Nếu số lần checkin <= số lần checkout, có thể thêm checkin
      return (!events || events.length === 0) || 
             (!oppositeEvents || events.length <= oppositeEvents.length);
    } else if (type === 'checkout') {
      // Nếu số lần checkout < số lần checkin, có thể thêm checkout
      return (!events || events.length === 0) || 
             (oppositeEvents && events.length < oppositeEvents.length);
    }
    return !events || events.length === 0;
  };

  const renderTimes = (
    events?: AttendanceEvent[],
    type?: 'checkin' | 'checkout' | 'lunchin' | 'lunchout',
    dayData?: any,
    date?: string,
    oppositeEvents?: AttendanceEvent[] // Events của type đối diện (checkin <-> checkout)
  ) => {
    const showAddButton = editMode === 'add' && type && date && 
      (type === 'lunchin' || type === 'lunchout' 
        ? (!events || events.length === 0)
        : shouldShowAddButton(type as 'checkin' | 'checkout', events, oppositeEvents)
      );

    return (
      <div className="flex flex-col my-2 gap-2">
        {/* Hiển thị các events hiện có */}
        {events && events.map((ev, i) => (
          <button
            key={i}
            onClick={() => {
              if (editMode === 'view') {
                onShowMap(ev.loc[0], ev.loc[1], getEventTypeLabel(type!), ev.time);
              } else if (editMode === 'edit' && type && date) {
                onEditRecord(date, type, ev, dayData);
              } else if (editMode === 'delete' && type && date) {
                onEditRecord(date, type, ev, dayData);
              }
            }}
            className={`font-semibold transition-all duration-200 text-sm w-fit ${
              getEventTypeColor(type!)
            } ${
              editMode === 'view' 
                ? 'underline hover:scale-105 cursor-pointer' 
                : editMode === 'edit'
                ? 'bg-yellow-100 px-2 py-1 rounded-lg hover:bg-yellow-200 cursor-pointer'
                : 'bg-red-100 px-2 py-1 rounded-lg hover:bg-red-200 cursor-pointer'
            }`}
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

        {/* Hiển thị nút Thêm nếu có thể */}
        {showAddButton && (
          <button
            onClick={() => onAddRecord(date, type, dayData)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 font-semibold text-sm w-fit px-2 py-1 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>追加</span>
          </button>
        )}

        {/* Hiển thị gạch ngang nếu không có events và không thể thêm */}
        {(!events || events.length === 0) && !showAddButton && (
          <span className="text-gray-400 font-semibold">-</span>
        )}
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">退勤</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ランチ</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">実働時間</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">普通時間</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">深夜時間</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {records.map((rec) => {
              const { data } = rec;
              const date = `${year}-${String(month).padStart(2, "0")}-${String(rec.day).padStart(2, "0")}`;

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
                  className={`${bgColor} transition-colors duration-200 ${
                    editMode === 'delete' ? 'cursor-pointer' : ''
                  }`}
                >
                  {/* 日付 */}
                  <td 
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textColor}`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${dayBgColor} ${textColor} ${
                        editMode === 'delete' ? 'hover:bg-red-200' : ''
                      }`}
                      onClick={() => {
                      if (editMode === 'delete' && data) {
                        onDeleteDay(date);
                      }
                    }}
                    >
                      {rec.day}
                      {editMode === 'delete' && (
                        <svg className="w-3 h-3 ml-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </span>
                  </td>

                  {/* 曜日 */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${textColor}`}
                  >
                    {rec.weekday}
                  </td>

                  {/* 出勤 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm align-top">
                    {renderTimes(
                      data?.checkin, 
                      'checkin', 
                      data, 
                      date,
                      data?.checkout // opposite events for logic
                    )}
                  </td>

                  {/* 退勤 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm align-top">
                    {renderTimes(
                      data?.checkout, 
                      'checkout', 
                      data, 
                      date,
                      data?.checkin // opposite events for logic
                    )}
                  </td>

                  {/* ランチ */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm align-top">
                    <div className="space-y-1">
                      {renderTimes(data?.lunchin, 'lunchin', data, date)}
                      {renderTimes(data?.lunchout, 'lunchout', data, date)}
                    </div>
                  </td>

                  {/* 実働時間 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {data?.workingHours != null ? `${data.workingHours.main.toFixed(1)}` : "-"}
                  </td>

                  {/* 普通時間 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {data?.workingHours != null ? `${data.workingHours.ot1.toFixed(1)}` : "-"}
                  </td>

                  {/* 深夜時間 */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    {data?.workingHours != null ? `${data.workingHours.ot2.toFixed(1)}` : "-"}
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
              出勤記録:{" "}
              {records.reduce((count, r) => count + (r.data?.checkin?.length || 0), 0)} 回
            </span>
            <span>
              退勤記録:{" "}
              {records.reduce((count, r) => count + (r.data?.checkout?.length || 0), 0)} 回
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;