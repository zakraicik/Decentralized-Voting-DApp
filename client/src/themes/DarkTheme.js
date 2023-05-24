import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
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
            // greens
            main: "#37b78c",
            light: "#73caa4",
            dark: "#2b8752", // This is a made-up value; replace with your actual dark green
            contrastText: "#ffffff",
            remove: "#8a8e94", // Text color when a primary color is used as a background
            disabled: "#D3D3D3",
        },
        secondary: {
            // greys
            main: "#505762",
            light: "#777b82", // This is a made-up value; replace with your actual light grey
            dark: "#22252a",
            contrastText: "#ffffff", // Text color when a secondary color is used as a background
        },
        background: {
            default: "#000000",
            container: "#111111",
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
                    backgroundColor: "rgba(55, 183, 140, 0.6)", // Adjust opacity here
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    // Add your global styles here
                    backgroundColor: "#505762",
                    color: "#fff",
                },
            },
        },
    },
});

export default darkTheme;
