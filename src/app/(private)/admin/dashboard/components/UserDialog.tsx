"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

const ROLES = ["ADMIN", "USER"];

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
        role: "engineer",
      });
    }
  }, [editingUser]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingUser ? "ユーザー更新" : "ユーザー作成"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="メールアドレス"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="名"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            fullWidth
          />
          <TextField
            label="姓"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="役割"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSubmit(form)}>
          {loadingSave ? ( <CircularProgress size={24} color="inherit" /> ) : ("保存")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
