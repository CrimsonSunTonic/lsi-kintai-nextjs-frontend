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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth/signinClient";
import { getUserClient } from "@/api/auth/getUserClient";

const SigninForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = await login(email, password);
      localStorage.setItem("access_token", token);
      await getUserClient();
      router.push("/");
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
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
          ログイン
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
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="tarou@email.com"
              autoComplete="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={
                emailError === "Email should not be empty"
                  ? "メールアドレスを入力してください"
                  : emailError === "Email must be a valid email address"
                  ? "有効なメールアドレスを入力してください"
                  : emailError
              }
            />
          </FormControl>

          {/* Password */}
          <FormControl>
            <FormLabel htmlFor="password">パスワード</FormLabel>
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
              helperText={
                passwordError === "Password should not be empty"
                  ? "パスワードを入力してください"
                  : passwordError === "Password must be at least 8 characters long"
                  ? "パスワードは8文字以上で入力してください"
                  : passwordError
              }
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.2, fontSize: "1rem", fontWeight: 600 }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography>
            アカウントをお持ちでない方はこちら{" "}
          </Typography>
          <Link href="/signup" variant="body2">
            新規登録
          </Link>
        </Box>
      </Card>
    </Container>
  );
};

export default SigninForm;
