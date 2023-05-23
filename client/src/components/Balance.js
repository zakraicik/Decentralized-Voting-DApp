import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Balance({ accountBalance }) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "6px 16px",
        borderRadius: `10px`,
        boxShadow: "0px 0px 10px 1px rgba(115, 202, 164, .3)",
      }}
    >
      <Typography variant="h2">
        {`${Number(accountBalance).toFixed(2)} ETH`}
      </Typography>
    </Box>
  );
}

export default Balance;
