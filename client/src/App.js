import React, { useState, useEffect } from "react";
import VotingComponent from "./components/VotingComponent";
import SetUpStepper from "./components/SetUpStepper";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  Switch,
  Typography,
} from "@mui/material";
import lightTheme from "./themes/LightTheme";
import darkTheme from "./themes/DarkTheme";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isWeb3BrowserDetected, setIsWeb3BrowserDetected] = useState(false);

  console.log(isWeb3BrowserDetected);
  const handleThemeChange = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsWeb3BrowserDetected(true);
    } else {
      setIsWeb3BrowserDetected(false);
    }
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      {!isWeb3BrowserDetected ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            px: 4,
            pt: 3,
          }}
        >
          <CssBaseline />

          <Box
            component="img"
            src="/logo.png"
            alt="Your Logo"
            sx={{
              display: "block",
              width: "115px",
              height: "auto",
              objectFit: "contain",
              mt: 0,
              mb: 4,
            }}
          />
          <SetUpStepper />
        </Box>
      ) : (
        <Box>
          <CssBaseline />
          <Box
            sx={{
              minHeight: "100vh",
              position: "relative",
            }}
          >
            <VotingComponent />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100px",
                }}
              >
                <Typography variant="caption">Dark Mode</Typography>
                <Switch checked={isDark} onChange={handleThemeChange} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
