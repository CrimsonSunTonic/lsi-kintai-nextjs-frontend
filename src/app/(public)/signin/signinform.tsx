"use client";

import { useState } from "react";
import {
  Card,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Link,
  Box,
  Typography,
  Container,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { login, UserData } from "@/api/auth/signinClient";
import { getUserClient } from "@/api/auth/getUserClient";

const SigninForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Form validation
  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email should not be empty");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email must be a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password should not be empty");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    }

    return valid;
  };

  // ✅ Handle Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = await login(email, password);
      localStorage.setItem("access_token", token);
      const user = await getUserClient(); // ✅ use getUserClient instead of getUserMe
      setUserData(user);
      setOpenDialog(true);
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    router.push("/");
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          p: 4,
          boxShadow: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            textAlign: "center",
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            mb: 2,
          }}
        >
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Email */}
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
          </FormControl>

          {/* Password */}
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography>
            Don&apos;t have an account?{" "}
            <Link href="/signup" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>

      {/* ✅ Dialog showing user info */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Login Successful</DialogTitle>
        <DialogContent dividers>
          {userData && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>ID: {userData.id}</Typography>
              <Typography>Email: {userData.email}</Typography>
              <Typography>
                Name: {userData.firstname} {userData.lastname}
              </Typography>
              <Typography>Role: {userData.role}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Go to Home</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SigninForm;
