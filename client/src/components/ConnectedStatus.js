import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import StatusLight from "./StatusLight";
import { useTheme } from "@mui/material/styles";

function ConnectedStatus({ isConnected, signerAddress }) {
  const theme = useTheme();
  const connectedColor1 = theme.palette.primary.light;
  const connectedColor2 = theme.palette.primary.dark;
  const disconnectedColor1 = theme.palette.disconnected.main;
  const disconnectedColor2 = theme.palette.disconnected.light;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {isConnected ? (
        <>
          <StatusLight color1={connectedColor1} color2={connectedColor2} />
          <Box sx={{ marginLeft: "6px" }}>
            <Stack>
              <Typography variant="h2">CONNECTED</Typography>
              {signerAddress && (
                <Typography variant="caption">
                  {signerAddress.slice(0, 6)}...{signerAddress.slice(-4)}
                </Typography>
              )}
            </Stack>
          </Box>
        </>
      ) : (
        <>
          <StatusLight
            color1={disconnectedColor1}
            color2={disconnectedColor2}
          />
          <Box sx={{ marginLeft: "6px" }}>
            <Typography variant="disconnected">DISCONNECTED</Typography>
          </Box>
        </>
      )}
    </div>
  );
}

export default ConnectedStatus;
