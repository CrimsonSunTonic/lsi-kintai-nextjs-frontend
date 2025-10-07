import { Container, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <Container
        maxWidth="xl"
        sx={{
            width: "100%",       // full width
            maxWidth: "1600px",  // or whatever max width you want
            px: 3,               // horizontal padding
        }}
    >
        <Typography
        variant="h3"
        mb={5}
        color="primary"
        fontWeight="bold"
        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
        Welcome to the Admin Dashboard
      </Typography>
    </Container>);
}