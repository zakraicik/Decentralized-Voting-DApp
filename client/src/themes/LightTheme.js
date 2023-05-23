import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
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
            // greens
            main: "#37b78c",
            light: "#73caa4",
            dark: "#2b8752", // This is a made-up value; replace with your actual dark green
            contrastText: "#ffffff", // Text color when a primary color is used as a background
        },
        secondary: {
            // greys
            main: "#505762",
            light: "#777b82", // This is a made-up value; replace with your actual light grey
            dark: "#22252a",
            contrastText: "#ffffff", // Text color when a secondary color is used as a background
        },
        background: {
            default: "#ffffff",
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
                    backgroundColor: "rgba(55, 183, 140, 0.6)", // Adjust opacity here
                },
            },
        },
    },
});

export default lightTheme;
