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
    user.role === "admin" ? ["Employees", "Records"] : ["Attendance", "Records"];

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "white",
        color: "black",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar variant="dense" disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
              LSI Attendance
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {menuItems.map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  onClick={() =>
                    router.push(
                      user.role === "admin"
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
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            <Typography>Welcome back, {user.firstname}</Typography>
            <Button variant="outlined" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          {/* Mobile Drawer */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2 }}>
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
                        user.role === "admin"
                          ? `/admin/${item.toLowerCase()}`
                          : `/user/${item.toLowerCase()}`
                      )
                    }
                  >
                    {item}
                  </MenuItem>
                ))}
                <Divider sx={{ my: 2 }} />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
