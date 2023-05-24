import React, { useState } from "react";
import VotingComponent from "./components/VotingComponent";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  Switch,
  Typography,
} from "@mui/material";
import lightTheme from "./themes/LightTheme";
import darkTheme from "./themes/DarkTheme"; // Make sure to create a DarkTheme


function App() {
  const [isDark, setIsDark] = useState(true);

  const handleThemeChange = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
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
    </ThemeProvider>
  );
}

export default App;
