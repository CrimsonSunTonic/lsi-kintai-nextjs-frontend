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
} from "@mui/material";

const SignupForm = () => {
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
          sx={{ textAlign: "center", width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', justifyContent: 'center', mb: 2 }}
        >
          Sign Up
        </Typography>

        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
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
            />
          </FormControl>

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
            />
          </FormControl>
          
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
            />
          </FormControl>

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
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
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
    </Container>
  );
};

export default SignupForm;