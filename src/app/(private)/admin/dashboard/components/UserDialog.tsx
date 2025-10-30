"use client";

import { useEffect, useState } from "react";

const ROLES = [
  { value: "ADMIN", label: "管理者" },
  { value: "USER", label: "社員" },
];

export default function UserDialog({ open, loadingSave, onClose, onSubmit, editingUser }: any) {
  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    role: "USER",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        email: editingUser.email,
        firstname: editingUser.firstname,
        lastname: editingUser.lastname,
        role: editingUser.role,
      });
    } else {
      setForm({
        email: "",
        firstname: "",
        lastname: "",
        role: "USER",
      });
    }
  }, [editingUser]);

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingUser ? "ユーザー更新" : "ユーザー作成"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {editingUser ? "ユーザー情報を更新します" : "新しいユーザーを作成します"}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
              placeholder="tarou@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名
            </label>
            <input
              type="text"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
              placeholder="太郎"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓
            </label>
            <input
              type="text"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder:text-gray-400"
              placeholder="山田"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              役割
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} className="text-gray-800">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            キャンセル
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={loadingSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loadingSave ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>保存中...</span>
              </>
            ) : (
              <span>保存</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}