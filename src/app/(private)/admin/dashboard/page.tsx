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
    try {
      if (editingUser) {
        console.log("check handleSave form >> ",form);
        console.log("check handleSave editingUser >> ",editingUser);
        await updateUserClient(editingUser.id, form);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
        );
      } else {
        const res = await createUserClient(form);
        setUsers((prev) => [...prev, res.user]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditingUser(null);
      setOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure to delete this user?")) return;
    await deleteUserClient(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
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

      <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Firstname</TableCell>
                <TableCell>Lastname</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.firstname}</TableCell>
                    <TableCell>{u.lastname}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="right">
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      <UserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
        editingUser={editingUser}
      />
    </Box>
  );
}
