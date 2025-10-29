"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  CircularProgress,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllUsersClient,
  createUserClient,
  updateUserClient,
  deleteUserClient,
  User,
  UpdateUser,
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
        社員管理
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(to right, #0f172a, #1e293b)",
          }}
          onClick={() => {
            setEditingUser(null);
            setOpen(true);
          }}
        >
          Create
        </Button>
      </Box>

      <UsersTable
        data={users}
        columns={[
          { id: "email", label: "Email" },
          { id: "firstname", label: "Firstname" },
          { id: "lastname", label: "Lastname" },
          { id: "role", label: "Role" },
          {
            id: "actions",
            label: "",
            render: (u) => (
              <Box className="flex gap-1 justify-end">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => {
                    setEditingUser(u);
                    setOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(u.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ),
          },
        ]}
      />


      <UserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
        editingUser={editingUser}
      />
    </Box>
  );
}
