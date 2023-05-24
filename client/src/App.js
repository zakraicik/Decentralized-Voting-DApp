import React, { useState, useEffect } from "react";
import VotingComponent from "./components/VotingComponent";
import SetUpStepper from "./components/SetUpStepper"
import {
  CssBaseline,
  ThemeProvider,
  Box,
  Switch,
  Typography,
  Container,
} from "@mui/material";
import lightTheme from "./themes/LightTheme";
import darkTheme from "./themes/DarkTheme"; // Make sure to create a DarkTheme



function App() {
  const [isDark, setIsDark] = useState(true);
  const [isWeb3BrowserDetected, setIsWeb3BrowserDetected] = useState(false);

  console.log(isWeb3BrowserDetected);
  const handleThemeChange = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
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
            justifyContent: "center",
            alignItems: "flex-start", // Change this to "flex-start"
            px: 4,
            pt: 7
          }}
        >
          <CssBaseline />

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
                  width: "100px", // Set a specific width here
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
