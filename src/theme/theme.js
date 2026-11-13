import { createTheme } from "@mui/material/styles";

const ink = "#12181B";
const display = '"Space Grotesk", "Inter", "Arial", sans-serif';
const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";

const theme = createTheme({
  palette: {
    // Mango is the action color; dark ink on mango keeps button text readable.
    primary: { main: "#FF7A29", dark: "#E15F0F", contrastText: ink },
    secondary: { main: "#0E4C47" },
    text: { primary: ink, secondary: "#4A5459" },
    background: { default: "#FAFAF7", paper: "#FFFFFF" },
    divider: "#E7E9E2",
    error: { main: "#B63A3A" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h3: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.03em" },
    h4: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontFamily: display, fontWeight: 600, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 42,
          paddingInline: 20,
          transition: `background-color 0.2s, box-shadow 0.3s ${easeOut}, transform 0.2s ${easeOut}, border-color 0.2s`,
          "&:active": { transform: "scale(0.98)" },
        },
        containedPrimary: {
          boxShadow: "0 10px 22px -12px rgba(255,122,41,0.75)",
          "&:hover": { boxShadow: "0 14px 26px -12px rgba(255,122,41,0.85)", transform: "translateY(-1px)" },
        },
        outlined: { borderColor: "#E7E9E2" },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { transition: `background-color 0.2s, color 0.2s, transform 0.2s ${easeOut}`, "&:active": { transform: "scale(0.94)" } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E7E9E2",
          boxShadow: "0 1px 2px rgba(18,24,27,0.04)",
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          transition: "box-shadow 0.25s, border-color 0.2s",
          "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(255,122,41,0.14)" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 24 } },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: { tooltip: { backgroundColor: ink, fontSize: 12, borderRadius: 8 }, arrow: { color: ink } },
    },
    MuiMenu: {
      styleOverrides: { paper: { borderRadius: 16, border: "1px solid #E7E9E2", boxShadow: "0 22px 44px -16px rgba(18,24,27,0.2)", marginTop: 8 } },
    },
  },
});

export default theme;