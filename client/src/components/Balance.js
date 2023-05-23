import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Balance({ accountBalance }) {
  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.container,
        padding: "6px 16px",
        borderRadius: `10px`,
        border: "1px solid rgba(115, 202, 164, .6)",
        boxShadow: "0px 0px 20px 3px rgba(115, 202, 164, .6)",
      }}
    >
      <Typography variant="h2">
        {`${Number(accountBalance).toFixed(2)} ETH`}
      </Typography>
    </Box>
  );
}

export default Balance;
