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
    h3: {
      color: "#37b78c",
      fontSize: "16px",
      letterSpacing: "0.1em",

      fontWeight: 600,
    },
    body: {
      fontSize: "16px",
      color: "#fff",
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
      disabled: "#D3D3D3",
    },
    secondary: {
      main: "#505762",
      light: "#777b82",
      dark: "#22252a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#000000",
      container: "#000000",
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
    MuiDialog: {
      styleOverrides: {
        root: {
          backgroundColor: "#505762",
          color: "#fff",
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
