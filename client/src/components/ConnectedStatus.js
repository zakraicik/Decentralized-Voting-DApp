import React from "react";
import TimelineDot from "@mui/lab/TimelineDot";
import { keyframes } from "@emotion/react";
import "@fontsource/roboto";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

const blink = keyframes`
  80% {opacity: .8;}
  90% {opacity: 0.9;}
  100% {opacity: 1;}
`;

function ConnectedStatus({ isConnected, signerAddress }) {
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
          <TimelineDot
            sx={{
              width: "5px",
              height: "5px",
              animation: `${blink} 1s linear infinite`,
              backgroundImage:
                "radial-gradient(circle at center, #73caa4, #2b8752)",
              // boxShadow: '0px 0px 10px 1px #73caa4'
            }}
          />

          <Container sx={{ padding: 0, marginLeft: "6px" }}>
            <Stack>
              <p
                style={{
                  margin: "0",
                  color: "#73caa4",
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "1",
                  fontFamily: "Roboto, sans-serif", // Add this line
                }}
              >
                CONNECTED
              </p>
              <p
                style={{
                  margin: "0",
                  color: "#73caa4",
                  fontWeight: 500,
                  fontSize: "10px",
                  lineHeight: "1",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {signerAddress.slice(0, 6)}...{signerAddress.slice(-4)}
              </p>
            </Stack>
          </Container>
        </>
      ) : (
        <p>Not connected to MetaMask</p>
      )}
    </div>
  );
}

export default ConnectedStatus;
