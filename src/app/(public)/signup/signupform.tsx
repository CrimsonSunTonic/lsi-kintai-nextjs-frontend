"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signup } from "../../../api/auth/signupClient";

const SignupForm = () => {
  const router = useRouter();

  // 🔹 Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  // 🔹 Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [error, setError] = useState("");

  // 🔹 Loading and dialog
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Live password matching validation
  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    if (password && value && value !== password) {
      setRepeatPasswordError("Passwords do not match");
    } else {
      setRepeatPasswordError("");
    }
  };

  // ✅ Validate fields before signup
  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
    setFirstnameError("");
    setLastnameError("");

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

    if (!repeatPassword.trim()) {
      setRepeatPasswordError("Please confirm your password");
      valid = false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError("Passwords do not match");
      valid = false;
    }

    if (!firstname.trim()) {
      setFirstnameError("First name should not be empty");
      valid = false;
    }

    if (!lastname.trim()) {
      setLastnameError("Last name should not be empty");
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
      await signup(email, password, firstname, lastname);
      setOpenDialog(true);
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    router.push("/signin");
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
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Sign Up
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
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel>Email</FormLabel>
            <TextField
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <TextField
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Repeat Password</FormLabel>
            <TextField
              type="password"
              placeholder="Re-enter your password"
              fullWidth
              required
              value={repeatPassword}
              onChange={(e) => handleRepeatPasswordChange(e.target.value)}
              error={!!repeatPasswordError}
              helperText={repeatPasswordError}
            />
          </FormControl>

          <FormControl>
            <FormLabel>First Name</FormLabel>
            <TextField
              placeholder="Enter your first name"
              fullWidth
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              error={!!firstnameError}
              helperText={firstnameError}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <TextField
              placeholder="Enter your last name"
              fullWidth
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              error={!!lastnameError}
              helperText={lastnameError}
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/signin" underline="hover">
              Log in
            </Link>
          </Typography>
        </Box>
      </Card>

      {/* ✅ Success Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          🎉 Signup Successful!
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "text.secondary",
          }}
        >
          Your account has been created successfully.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogClose}
            sx={{ px: 4 }}
          >
            Go to Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignupForm;
