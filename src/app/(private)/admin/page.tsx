import { Container, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        maxWidth: "1600px",
        px: 3,
        minHeight: "80vh", // gives vertical space
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center", // vertical center
        flexDirection: "column", // stack items vertically if needed
        textAlign: "center", // center text
      }}
    >
      <Typography
        variant="h3"
        mb={5}
        color="primary"
        fontWeight="bold"
        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
        管理ページへようこそ！
      </Typography>
    </Container>
  );
}