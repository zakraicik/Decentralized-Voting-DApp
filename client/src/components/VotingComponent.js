import React, { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";

import contractABI from "../contracts/VotingSystem.json";
import {
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Card,
  CardActions,
  CardContent,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
} from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";
import ShimmerButton from "./ShimmerButton";
import GradientFab from "./GradientFab";
import { useSnackbar } from "../hooks/useSnackbar";
import { useDialog } from "../hooks/useDialog";
import { ConnectButton } from '@rainbow-me/rainbowkit';

function VotingComponent() {
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [signerAddress, setSignerAddress] = useState(null);
  const [votingStatus, setVotingStatus] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);


  const { snackbarOpen, snackbarMessage, openSnackbar, closeSnackbar } =
    useSnackbar();
  const { dialogOpen, openDialog, closeDialog } = useDialog();

  const handleAdd = () => {
    addProposal();
    closeDialog();
  };

  useEffect(() => {
    async function refreshData() {

      const provider = new ethers.BrowserProvider(window.ethereum);

      if (provider) {
        try {

          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {

            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();
            setSignerAddress(signerAddress);

            const contract = new Contract(
              "0xEa3B222f4cB625a64937323a21fA73ec7A24A0d9",
              contractABI.abi,
              signer
            );

            const owner = await contract.owner();

            setIsOwner(signerAddress === owner);
            setContract(contract);

            const count = await contract.getProposalsCount();
            const proposals = [];
            const votingStatus = {};
            for (let i = 0; i < count; i++) {
              const proposal = await contract.getProposal(i);
              proposals.push(proposal);
              const hasUserVotedForProposal = await contract.hasVoted(
                i,
                signerAddress
              );
              votingStatus[i] = hasUserVotedForProposal;
            }
            setVotingStatus(votingStatus);
            setProposals(proposals);
          }

        } catch (err) {
          console.log(err);

        }
      } else {
        console.error("Connect Wallet");
      }
    }

    refreshData();

    window.ethereum.on("accountsChanged", function (accounts) {
      refreshData();
    });
  }, []);

  async function addProposal() {
    if (contract && newTitle !== "" && newDescription !== "" && isOwner) {
      try {
        const tx = await contract.createProposal(newTitle, newDescription);
        await tx.wait();
        openSnackbar("Proposal added successfully!");
        setNewTitle("");
        setNewDescription("");

        const count = await contract.getProposalsCount();
        const proposals = [];
        for (let i = 0; i < count; i++) {
          const proposal = await contract.getProposal(i);
          proposals.push(proposal);
        }
        setProposals(proposals);
        setCurrentSlide(count);
      } catch (err) {
        console.error("Error adding proposal:", err);
      }
    } else if (!isOwner) {
      openSnackbar("Only owners can add proposals");
    } else {
      openSnackbar("Please enter both title and description");
    }
  }

  async function removeProposal(proposalIndex) {
    if (contract && isOwner) {
      try {
        const tx = await contract.removeProposal(proposalIndex);
        await tx.wait();
        openSnackbar("Proposal removed successfully!");

        const count = await contract.getProposalsCount();
        const updatedProposals = [];
        const updatedVotingStatus = {};

        for (let i = 0; i < count; i++) {
          const proposal = await contract.getProposal(i);
          updatedProposals.push(proposal);
          const hasUserVotedForProposal = await contract.hasVoted(
            i,
            signerAddress
          );
          updatedVotingStatus[i] = hasUserVotedForProposal;
        }

        setProposals(updatedProposals);
        setVotingStatus(updatedVotingStatus);

        if (proposalIndex > 0) {
          setCurrentSlide(proposalIndex - 1);
        } else {
          setCurrentSlide(0);
        }
      } catch (err) {
        console.error("Error removing proposal:", err);
      }
    } else if (!isOwner) {
      openSnackbar("Only owners can remove proposals");
    }
  }

  async function vote(proposalId) {
    if (contract) {
      try {
        const hasUserVotedForProposal = await contract.hasVoted(
          proposalId,
          signerAddress
        );

        if (!hasUserVotedForProposal) {
          const tx = await contract.vote(proposalId);

          await tx.wait();

          setVotingStatus((prevVotingStatus) => ({
            ...prevVotingStatus,
            [proposalId]: true,
          }));

          openSnackbar("Vote cast successfully!");
          const count = await contract.getProposalsCount();
          const proposals = [];
          for (let i = 0; i < count; i++) {
            const proposal = await contract.getProposal(i);
            proposals.push(proposal);
          }
          setProposals(proposals);
        } else {
          openSnackbar("Already voted.");
        }
      } catch (err) {
        console.error("Error casting vote:", err);
      }
    }
  }

  return (
    <Container maxWidth={false}>
      <Stack>
        <Box
          sx={{
            position: "fixed",
            top: "20px",
            left: "20px",
            right: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box sx={{
            borderRadius: "10px",
            boxShadow: "0px 0px 17px 3px rgba(118,219,205, .45)",
          }}>
            <ConnectButton accountStatus="address" chainStatus="none" showBalance={true} />

          </Box>
        </Box>

        <Container
          sx={{
            marginTop: "80px",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Your Logo"
            sx={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              width: "115px",
              height: "auto",
              objectFit: "contain",
              mt: -1,
              mb: 6,
            }}
          />
          {proposals.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                style={{
                  border: "1px solid rgba(118,219,205, .6)",
                  boxShadow: "0px 0px 14px 3px rgba(118,219,205, .45)",
                  padding: "20px",

                  width: "80%",
                  borderRadisu: "10px",
                  margin: "auto",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexBasis: "0",
                    flexGrow: 1,
                  }}
                >
                  There are currently no proposals
                </Typography>
              </Box>
            </Box>
          ) : (
            <Container
              sx={{
                overflow: "visible",
                boxShadow: "0px 0px 20px 3px rgba(118,219,205, .45)",
                marginLeft: "auto",
                marginRight: "auto",
                padding: "0 !important",
                borderRadius: "8px",
                width: "80%",
              }}
            >
              <Carousel
                autoPlay={false}
                indicators={false}
                index={currentSlide}
                onChange={(index) => setCurrentSlide(index)}
                sx={{
                  width: "100%",
                  margin: 0,
                  padding: 0,
                  boxSizing: "border-box",
                }}
              >
                {proposals.map((proposal, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      borderColor: (theme) => theme.palette.background.outline,
                      width: "100%",
                      m: 0,
                      p: 0,
                      boxSizing: "border-box",
                      borderRadius: "8px",
                      backgroundColor: (theme) =>
                        theme.palette.background.container,
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: 0,
                        marginBottom: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexBasis: "0",
                          flexGrow: 1,
                        }}
                      >
                        <Typography variant="h1">{proposal.title}</Typography>
                        {isOwner && (
                          <Box
                            sx={{
                              position: "relative",
                              bottom: 0,
                              right: 0,
                              zIndex: 10000,
                            }}
                          >
                            <IconButton
                              onClick={() => removeProposal(index)}
                              sx={{
                                height: "48px",
                                color: (theme) => theme.palette.primary.remove,
                                width: "48px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: "25px" }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardContent>
                      <Typography variant="body">
                        {proposal.description}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                        }}
                      >
                        <LocalFireDepartmentIcon
                          sx={{ color: "#fc9847", marginLeft: "5px" }}
                        />
                        <Typography
                          variant="h2"
                          sx={{
                            color: "#fc9847",
                            marginLeft: "5px",
                            fontSize: "15px",
                          }}
                        >
                          {proposal.voteCount.toString()}
                        </Typography>
                      </Box>

                      <ShimmerButton
                        variant="contained"
                        onClick={() => vote(index)}
                        disabled={votingStatus[index]}
                      >
                        {votingStatus[index] ? (
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.primary.disabled,
                            }}
                          >
                            Voted
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              color: (theme) =>
                                theme.palette.primary.contrastText,
                            }}
                          >
                            Vote
                          </Typography>
                        )}
                      </ShimmerButton>
                    </CardActions>
                  </Card>
                ))}
              </Carousel>
            </Container>
          )}
        </Container>
      </Stack>

      <Container
        sx={{
          marginTop: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Dialog open={dialogOpen} onClose={() => closeDialog()}>
          <DialogTitle
            sx={{
              backgroundColor: (theme) => theme.palette.background.container,
            }}
          >
            <Typography variant="body">Add a Proposal</Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: (theme) => theme.palette.background.container,
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  color: (theme) => theme.typography.body.color,
                },
                label: { color: (theme) => theme.typography.body.color },
                "& .MuiInput-underline:before": {
                  borderBottomColor: (theme) => theme.typography.body.color,
                },
              }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  color: (theme) => theme.typography.body.color,
                },
                label: { color: (theme) => theme.typography.body.color },
                "& .MuiInput-underline:before": {
                  borderBottomColor: (theme) => theme.typography.body.color,
                },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: (theme) => theme.palette.background.container,
            }}
          >
            <Button onClick={() => closeDialog()}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogActions>
        </Dialog>

        <GradientFab openDialog={openDialog} isOwner={isOwner} />
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default VotingComponent;
