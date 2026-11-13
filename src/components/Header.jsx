import { useState } from "react";
import {
  AppBar, Box, Button, Chip, Divider, Drawer, IconButton, InputAdornment, List,
  ListItemButton, ListItemText, Menu, MenuItem, TextField, Toolbar, Tooltip, Typography,
} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import LoginRounded from "@mui/icons-material/LoginRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import {
  Link as RouterLink, useLocation, useNavigate, useSearchParams,
} from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

// Underline that grows in under the active nav item
const navButtonSx = (active) => ({
  position: "relative",
  color: active ? "text.primary" : "text.secondary",
  fontWeight: active ? 700 : 500,
  px: 1.75,
  "&:hover": { bgcolor: "transparent", color: "text.primary" },
  "&::after": {
    content: '""',
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 4,
    height: 2,
    borderRadius: 2,
    bgcolor: "primary.main",
    transform: active ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
  },
  "&:hover::after": { transform: "scaleX(1)" },
});

export default function Header({ categories = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { admin, logout, openLogin } = useAdmin();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [term, setTerm] = useState("");

  const activeCategory = params.get("category") || "All";
  const onCatalog = location.pathname === "/" || location.pathname.startsWith("/products");
  const categoryActive = location.pathname === "/" && activeCategory !== "All";

  const goCategory = (name) => {
    navigate(name === "All" ? "/" : `/?category=${encodeURIComponent(name)}`);
    setMenuAnchor(null);
    setDrawerOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const value = term.trim();
    navigate(value ? `/?q=${encodeURIComponent(value)}` : "/");
    setDrawerOpen(false);
  };

  const searchField = (
    <TextField
      size="small"
      placeholder="Search products"
      value={term}
      onChange={(event) => setTerm(event.target.value)}
      fullWidth
      slotProps={{
        htmlInput: { "aria-label": "Search products" },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(250,250,247,0.82)",
        color: "text.primary",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ width: "var(--page-width)", mx: "auto", px: 0, minHeight: { xs: 64, md: 72 }, gap: 1 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h5"
          sx={{ color: "inherit", fontWeight: 700, letterSpacing: "-0.01em", mr: { md: 4 }, flexGrow: { xs: 1, md: 0 } }}
        >
          S<Box component="span" sx={{ color: "primary.main" }}>TEFA</Box>
        </Typography>

        {/* Desktop navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", flexGrow: 1 }}>
          <Button component={RouterLink} to="/" color="inherit" sx={navButtonSx(onCatalog && !categoryActive)}>
            Catalog
          </Button>
          <Button
            color="inherit"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            endIcon={<KeyboardArrowDownRounded />}
            aria-haspopup="true"
            aria-expanded={Boolean(menuAnchor)}
            sx={navButtonSx(categoryActive)}
          >
            {categoryActive ? activeCategory : "Categories"}
          </Button>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            {["All", ...categories].map((name) => (
              <MenuItem key={name} selected={name === activeCategory && location.pathname === "/"} onClick={() => goCategory(name)} sx={{ minWidth: 180, borderRadius: 2, mx: 0.5 }}>
                {name === "All" ? "All products" : name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box component="form" onSubmit={submitSearch} sx={{ display: { xs: "none", md: "block" }, width: 260 }}>
          {searchField}
        </Box>

        {/* Admin session */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, ml: 1 }}>
          {admin ? (
            <>
              <Chip icon={<AdminPanelSettingsOutlined />} label={admin.name || "Admin"} variant="outlined" sx={{ fontWeight: 600 }} />
              <Tooltip title="Log out">
                <IconButton aria-label="Log out" onClick={logout}>
                  <LogoutRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Button variant="outlined" color="inherit" startIcon={<LoginRounded />} onClick={openLogin}>
              Admin login
            </Button>
          )}
        </Box>

        {/* Mobile menu button */}
        <IconButton
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { md: "none" } }}
        >
          <MenuRounded />
        </IconButton>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: "min(320px, 86vw)", p: 2.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">
            S<Box component="span" sx={{ color: "primary.main" }}>TEFA</Box>
          </Typography>
          <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <CloseRounded />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={submitSearch} sx={{ mb: 2 }}>
          {searchField}
        </Box>

        <List disablePadding>
          <ListItemButton component={RouterLink} to="/" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2 }}>
            <ListItemText primary="Catalog" slotProps={{ primary: { fontWeight: 600 } }} />
          </ListItemButton>
        </List>
        <Divider sx={{ my: 1.5 }} />
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, letterSpacing: "0.06em" }}>
          CATEGORIES
        </Typography>
        <List>
          {categories.map((name) => (
            <ListItemButton key={name} selected={name === activeCategory && location.pathname === "/"} onClick={() => goCategory(name)} sx={{ borderRadius: 2 }}>
              <ListItemText primary={name} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1.5 }} />
        <List disablePadding>
          {admin ? (
            <ListItemButton onClick={() => { logout(); setDrawerOpen(false); }} sx={{ borderRadius: 2 }}>
              <ListItemText primary={`Log out (${admin.name || "Admin"})`} />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => { setDrawerOpen(false); openLogin(); }} sx={{ borderRadius: 2 }}>
              <ListItemText primary="Admin login" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}