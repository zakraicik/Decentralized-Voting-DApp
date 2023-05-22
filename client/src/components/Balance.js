import React from "react";

import "@fontsource/roboto";
import Box from "@mui/material/Box";

function Balance({ accountBalance }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        size="small"
        sx={{
          color: "#73caa4",
          backgroundColor: "white",
          fontFamily: "Roboto, sans-serif",
          padding: "6px 16px",
          fontSize: "12px",
          fontWeight: 700,
          // border: '1px solid rgba(58, 62, 69, 0.5)',
          borderRadius: `10px`,
          boxShadow: "0px 0px 10px 1px rgba(115, 202, 164, .3)",
        }}
      >
        {`${Number(accountBalance).toFixed(2)} ETH`}
      </Box>
    </div>
  );
}

export default Balance;
