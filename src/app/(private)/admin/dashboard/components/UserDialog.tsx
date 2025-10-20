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
} from "@mui/material";
import { useEffect, useState } from "react";

const ROLES = ["ADMIN", "USER"];

export default function UserDialog({ open, onClose, onSubmit, editingUser }: any) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    role: "USER",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        email: editingUser.email,
        password: "",
        firstname: editingUser.firstname,
        lastname: editingUser.lastname,
        role: editingUser.role,
      });
    } else {
      setForm({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        role: "engineer",
      });
    }
  }, [editingUser]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
          {!editingUser && (
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
            />
          )}
          <TextField
            label="First name"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            fullWidth
          />
          <TextField
            label="Last name"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Role"
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
