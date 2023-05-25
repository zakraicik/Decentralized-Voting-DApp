import React, { useState, useEffect } from "react";
import VotingComponent from "./components/VotingComponent";
import SetUpStepper from "./components/SetUpStepper";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import Theme from "./themes/Theme";

function App() {
  const [isWeb3BrowserDetected, setIsWeb3BrowserDetected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsWeb3BrowserDetected(true);
    } else {
      setIsWeb3BrowserDetected(false);
    }
  }, []);

  return (
    <ThemeProvider theme={Theme}>
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
            ></Box>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
