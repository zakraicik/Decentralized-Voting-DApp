import * as React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
} from "@mui/material";
import ShimmerButton from "./ShimmerButton";

const steps = [
  {
    label: "Download Metamask",
    description: `MetaMask is a browser extension and mobile application that functions as a cryptocurrency wallet, enabling users to interact with decentralized applications (DApps) on the Ethereum blockchain.`,
  },
  {
    label: "Setup Metamask Account",
    description:
      "A wallet is needed to connect to DApps because it provides a secure way to manage and use your digital assets and identity on the blockchain.",
  },
  {
    label: "Metamask Browser ",
    description: `Navigate to this app on the Metamask browser. DApps need to connect to a wallet because the wallet serves as a user's identity and means of transacting with the blockchain-based application.`,
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Box
        sx={{
          boxShadow: "0px 0px 14px 3px rgba(118,219,205, .45)",
          borderRadius: "10px",

          p: 2,
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                <Typography variant="h3">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body">{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <ShimmerButton
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </ShimmerButton>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
      {activeStep === steps.length && (
        <Box sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Box>
      )}
    </Box>
  );
}
