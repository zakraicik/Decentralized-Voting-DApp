import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Balance({ accountBalance }) {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.container,
        padding: "6px 16px",
        borderRadius: `10px`,
        border: "1px solid rgba(118,219,205, .6)",
        boxShadow: "0px 0px 14px 3px rgba(118,219,205, .45)",
      }}
    >
      <Typography variant="h2">
        {`${Number(accountBalance).toFixed(2)} ETH`}
      </Typography>
    </Box>
  );
}

export default Balance;
