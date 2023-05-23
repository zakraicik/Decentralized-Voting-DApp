import React from "react";
import VotingComponent from "./components/VotingComponent";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import lightTheme from "./themes/LightTheme";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
        }}
      >
        <VotingComponent />
      </Box>
    </ThemeProvider>
  );
}

export default App;
