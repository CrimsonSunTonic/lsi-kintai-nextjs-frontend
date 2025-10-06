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
import { signup, SignupData } from "../../../api/auth/signupClient";

const SignupForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<SignupData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Validate fields before signup
  const validateForm = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");
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

    if (!validateForm()) return; // stop if validation fails

    setLoading(true);
    try {
      const user = await signup(email, password, firstname, lastname);
      setUserData(user);
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
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            mb: 2,
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
            width: "100%",
            gap: 2,
          }}
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
              variant="outlined"
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
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
          </FormControl>

          {/* First Name */}
          <FormControl>
            <FormLabel htmlFor="firstname">First Name</FormLabel>
            <TextField
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
              fullWidth
              variant="outlined"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              error={!!firstnameError}
              helperText={firstnameError}
            />
          </FormControl>

          {/* Last Name */}
          <FormControl>
            <FormLabel htmlFor="lastname">Last Name</FormLabel>
            <TextField
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
              fullWidth
              variant="outlined"
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
            <Link href="/signin" variant="body2">
              Log in
            </Link>
          </Typography>
        </Box>
      </Card>

      {/* ✅ Success Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Signup Successful</DialogTitle>
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
          <Button onClick={handleDialogClose}>Go to Sign In</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignupForm;
