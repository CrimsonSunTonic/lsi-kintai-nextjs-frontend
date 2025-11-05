"use client";

import { useEffect, useState } from "react";
import { 
  getAllUsersClient, 
  createUserClient, 
  updateUserClient, 
  deleteUserClient, 
  User, 
  UpdateUser 
} from "@/api/admin/adminClient";
import UserDialog from "./components/UserDialog";
import { confirmDialog, notify } from "@/utils/sweetalertHelp";
import UsersTable from "./components/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingSave, setLoadingSave] = useState(false);

  // Fetch users
  useEffect(() => {
    async function load() {
      try {
        const data = await getAllUsersClient();
        
        setUsers(data);
      } catch {
        console.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (form: UpdateUser) => {
    const handle_type = editingUser ? "更新" : "追加";
    setLoadingSave(true);

    try {
      if (editingUser) {
        await updateUserClient(editingUser.id, form);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
        );
      } else {
        await createUserClient(form);
        const data = await getAllUsersClient();
        setUsers(data);
      }

      notify("success", `${handle_type}しました!`, `ユーザー${handle_type}が成功しました。`);
    } catch (e) {
      notify("error", "エラー!", `ユーザー${handle_type}が失敗しました。`);
    } finally {
      setEditingUser(null);
      setOpen(false);
    }

    setLoadingSave(false);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDialog({
      title: "削除確認",
      text: "このユーザーを削除しますか?",
      icon: "warning",
      confirmButtonText: "削除",
      cancelButtonText: "キャンセル",
    });

    if (!confirmed) return;

    try {
      await deleteUserClient(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      notify("success", "削除しました!", "ユーザー削除が成功しました。");
    } catch (err) {
      notify("error", "エラー!", "ユーザー削除が失敗しました。");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">読み込み中...</p>
        </div>
      </div>
    );

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">社員管理システム</h1>
                <p className="text-gray-600 text-lg">
                  従業員情報の一元管理と効率的な人事業務をサポート
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                管理画面
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{users.length} 名</div>
              <div className="text-gray-500 text-sm">登録社員数</div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">管理者: <strong>{users.filter(u => u.role === '管理者').length}</strong> 名</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">総社員: <strong>{users.filter(u => u.role === '社員').length}</strong> 名</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setEditingUser(null);
                  setOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 group"
              >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>新規社員登録</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table with Glass Effect */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <UsersTable
          data={users}
          columns={[
            { id: "email", label: "メールアドレス" },
            { id: "firstname", label: "名" },
            { id: "lastname", label: "姓" },
            { id: "role", label: "役割" },
            {
              id: "actions",
              label: "操作",
              render: (u) => (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingUser(u);
                      setOpen(true);
                    }}
                    className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(u.id);
                    }}
                    className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <UserDialog
        open={open}
        loadingSave={loadingSave}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
        editingUser={editingUser}
      />
    </div>
  );
}