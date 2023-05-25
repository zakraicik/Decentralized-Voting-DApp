import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      color: "#37b78c",
      fontSize: "24px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontWeight: 900,
    },
    h2: {
      color: "#37b78c",
      fontSize: "12px",
      fontWeight: 700,
      lineHeight: "1",
    },
    body: {
      fontSize: "16px",
      color: "#505762",
      fontWeight: 400,
    },
    caption: {
      color: "#37b78c",
      fontWeight: 500,
      fontSize: "10px",
      lineHeight: "1",
    },
    disconnected: {
      color: "#ca737c",
      fontSize: "12px",
      fontWeight: 700,
      lineHeight: "1",
    },
  },
  palette: {
    primary: {
      main: "#37b78c",
      light: "#73caa4",
      dark: "#2b8752",
      contrastText: "#ffffff",
      remove: "#8a8e94",
      disabled: "#666666",
    },
    secondary: {
      main: "#505762",
      light: "#777b82",
      dark: "#22252a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      dark: "#000000",
      outline: "rgba(115, 202, 164, .6)",
    },
    disconnected: {
      main: "#ca737c",
      light: "#87532b",
    },
  },
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(55, 183, 140, 0.6)",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          "&.Mui-active.MuiStepLabel-alternativeLabel": {
            color: "common.white",
          },
        },
      },
    },
  },
});

export default Theme;
