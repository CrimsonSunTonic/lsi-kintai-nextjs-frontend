"use client";

import React, { useState, useEffect } from "react";
import { AttendanceEvent } from "../utils/attendanceUtils";

interface EditAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: AttendanceEvent) => void;
  record: {
    date: string;
    type: 'checkin' | 'checkout' | 'lunchin' | 'lunchout';
    event?: AttendanceEvent;
    dayData?: any;
  } | null;
  mode: 'view' | 'add' | 'edit' | 'delete';
}

const EditAttendanceDialog: React.FC<EditAttendanceDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  record,
  mode
}) => {
  const [time, setTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (record?.event) {
      setTime(record.event.time);
      setLatitude(record.event.loc[0].toString());
      setLongitude(record.event.loc[1].toString());
    } else {
      setTime("");
      setLatitude("");
      setLongitude("");
    }
  }, [record]);

  const getEventTypeLabel = (type: 'checkin' | 'checkout' | 'lunchin' | 'lunchout') => {
    switch (type) {
      case 'checkin': return '出勤';
      case 'checkout': return '退勤';
      case 'lunchin': return 'ランチ（行く）';
      case 'lunchout': return 'ランチ（戻る）';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'delete' && record?.event) {
      // For delete mode, we pass the event to be deleted
      onSave(record.event);
      return;
    }

    if (!time || !latitude || !longitude) {
      alert("全てのフィールドを入力してください。");
      return;
    }

    const newEvent: AttendanceEvent = {
      id: record?.event?.id || Date.now(),
      time,
      loc: [parseFloat(latitude), parseFloat(longitude)]
    };

    onSave(newEvent);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("このブラウザは位置情報をサポートしていません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      (error) => {
        alert("位置情報の取得に失敗しました。");
        console.error("Geolocation error:", error);
      }
    );
  };

  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className={`p-6 rounded-t-3xl ${
          mode === 'add' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
          mode === 'edit' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
          'bg-gradient-to-r from-red-500 to-rose-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {mode === 'add' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {mode === 'edit' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
                {mode === 'delete' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'add' && '勤怠記録追加'}
                  {mode === 'edit' && '勤怠記録編集'}
                  {mode === 'delete' && '勤怠記録削除'}
                </h2>
                <p className="text-white/80 text-sm">
                  {record.date} - {getEventTypeLabel(record.type)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'delete' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">この記録を削除しますか？</h3>
              <p className="text-gray-600 mb-2">
                {record.event?.time} - {getEventTypeLabel(record.type)}
              </p>
              <p className="text-sm text-gray-500">
                この操作は元に戻せません。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {record?.event && mode !== 'add' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                    <div className="flex items-center text-sm text-blue-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>この日には <span className="font-bold">{record.dayData?.[record.type]?.length || 0}</span> 回の{getEventTypeLabel(record.type)}記録があります</p>
                    </div>
                    </div>
              )}

              {/* Time Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  時間 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/80 text-gray-800"
                  required
                />
              </div>

              {/* Location Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    緯度 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/80 text-gray-800"
                    placeholder="35.6895"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    経度 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/80 text-gray-800"
                    placeholder="139.6917"
                    required
                  />
                </div>
              </div>

              {/* Current Location Button */}
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>現在地を取得</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-3xl border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all duration-300 ${
                mode === 'add' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                  : mode === 'edit'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
              }`}
            >
              {mode === 'add' && '追加'}
              {mode === 'edit' && '更新'}
              {mode === 'delete' && '削除'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAttendanceDialog;