"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useRouter } from "next/navigation";
import type { UserData } from "../api/auth/getUserClient";

const AppHeader = ({ user }: { user: UserData }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/signin");
  };

  const menuItems =
    user.role === "ADMIN" ? ["Employees", "Records"] : ["Attendance", "Records"];

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 3,
        bgcolor: "#ffffff",
        color: "#1a1a1a",
        borderBottom: "1px solid #e0e0e0",
        backdropFilter: "blur(8px)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          maxWidth: "1600px",
          px: { xs: 2, md: 3 },
        }}
      >
        <Toolbar
          variant="dense"
          disableGutters
          sx={{ justifyContent: "space-between", minHeight: 64 }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                color: "#1976d2",
              }}
            >
              LSI 勤怠システム
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item}
                  color="primary"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,       // bolder text
                    fontSize: "1.15rem",   // bigger font size
                    px: 3,                 // horizontal padding
                    py: 1.2,               // vertical padding
                    "&:hover": {
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                    },
                  }}
                  onClick={() =>
                    router.push(
                      user.role === "ADMIN"
                        ? `/admin/${item.toLowerCase()}`
                        : `/user/${item.toLowerCase()}`
                    )
                  }
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#1976d2", width: 44, height: 44, fontSize: "1.1rem" }}>
              {user.firstname.charAt(0)}
            </Avatar>
            <Typography
              sx={{ fontWeight: 600, fontSize: "1.15rem", color: "#555555" }}
            >
              Hi, {user.firstname} {user.lastname}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                borderColor: "#1976d2",
                color: "#1976d2",
                fontWeight: 600,
                fontSize: "1.15rem",
                px: 3,
                py: 1.2,
                "&:hover": {
                  bgcolor: "#e3f2fd",
                  borderColor: "#1976d2",
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>


          {/* Mobile Drawer */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={toggleDrawer(true)} color="primary">
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  borderRadius: "0 0 12px 12px",
                  p: 2,
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
              {menuItems.map((item) => (
                <MenuItem
                  key={item}
                  onClick={() =>
                    router.push(
                      user.role === "ADMIN"
                        ? `/admin/${item.toLowerCase()}`
                        : `/user/${item.toLowerCase()}`
                    )
                  }
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  {item}
                </MenuItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Logout
              </MenuItem>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
