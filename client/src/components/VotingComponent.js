import React, { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import contractABI from "../contracts/VotingSystem.json";
import Container from "@mui/material/Container";
import ConnectedStatus from "./ConnectedStatus";
import Balance from "./Balance";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import "@fontsource/roboto";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Carousel from "react-material-ui-carousel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Divider from '@mui/material/Divider';

const ShimmerVoteButton = styled(Button)`
  position: relative;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 5s infinite linear;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

function VotingComponent() {
    const [contract, setContract] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [signerAddress, setSignerAddress] = useState(null);
    const [accountBalance, setAccountBalance] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [votingStatus, setVotingStatus] = useState({});

    const openDialog = () => {
        setDialogOpen(true);
    };

    const handleAdd = () => {
        addProposal();
        setDialogOpen(false);
    };

    const openSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    useEffect(() => {
        async function initialize() {
            const provider = new ethers.BrowserProvider(window.ethereum);

            if (provider) {
                try {
                    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const signer = await provider.getSigner();
                    const signerAddress = await signer.getAddress();
                    setSignerAddress(signerAddress);

                    const balance = await provider.getBalance(signerAddress);

                    setAccountBalance(ethers.formatEther(balance));

                    const contract = new Contract(
                        "0x6567c84fDf23c0a54585320a9a9048EA8a45eB37",
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
                    setIsConnected(true);
                } catch (err) {
                    console.log(err);
                    setIsConnected(false);
                }
            } else {
                console.error("Please install MetaMask!");
                setIsConnected(false);
            }
        }
        initialize();
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
                setVotingStatus(updatedVotingStatus); // Update the votingStatus state
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

                    // Update the votingStatus state to reflect the new vote
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
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "20px",
                        right: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        zIndex: 9999,
                        backgroundColor: "transparent", // This will make the div's background transparent
                    }}
                >
                    <ConnectedStatus
                        isConnected={isConnected}
                        signerAddress={signerAddress}
                    />
                    <Balance accountBalance={accountBalance} />
                </div>

                <Container
                    maxWidth="sm"
                    sx={{
                        marginTop: "80px",
                    }}
                >
                    <img
                        src="/logo.png"
                        alt="Your Logo"
                        style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "50%",
                            height: "auto",
                            objectFit: "contain",
                            marginTop: "20px",
                            marginBottom: "50px",
                        }}
                    />

                    <Stack
                        spacing={2}
                        style={{ boxShadow: "0px 0px 25px 6px rgba(115, 202, 164, .3)" }}
                    >
                        <Carousel
                            autoPlay={false}
                            indicators={false}
                            style={{ borderRadius: "10px" }}
                        >
                            {proposals.map((proposal, index) => (
                                <Card
                                    key={index}
                                    style={{
                                        color: "#ffffff",
                                        fontFamily: "Roboto, sans-serif",
                                    }}
                                >
                                    <CardContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: "#37b78c",
                                                display: "flex",
                                                alignItems: "center",
                                                flexBasis: "0",
                                                flexGrow: 1,
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    fontSize: "24px",
                                                    letterSpacing: "0.1em",
                                                    fontFamily: "Roboto, sans-serif",
                                                    textTransform: "uppercase",
                                                    fontWeight: 900,
                                                }}
                                            >
                                                {proposal.title}
                                            </Typography>
                                            {isOwner && (
                                                <div
                                                    style={{ position: "relative", bottom: 0, right: 0, zIndex: 10000 }}
                                                >
                                                    <IconButton

                                                        onClick={() => removeProposal(index)}
                                                        style={{
                                                            height: "48px",
                                                            color: "#ecf6f0",
                                                            width: "48px",
                                                            borderRadius: "50%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <DeleteIcon style={{ fontSize: "25px" }} />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <LocalFireDepartmentIcon
                                                style={{ color: "#fc9847", marginLeft: "5px" }}
                                            />
                                            <span style={{ color: "#fc9847", marginLeft: "5px" }}>
                                                {proposal.voteCount.toString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                    {/* <Divider style={{ margin: '0 auto' }} /> */}
                                    <CardContent
                                        style={{ color: "#505762", marginBottom: "25px" }}
                                    >
                                        <Typography variant="body1">
                                            {proposal.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end", // Add this
                                            alignItems: "flex-end", // Change this
                                            position: "relative",
                                        }}
                                    >
                                        <ShimmerVoteButton
                                            variant="contained"
                                            color="primary"
                                            onClick={() => vote(index)}
                                            disabled={votingStatus[index]}
                                            style={{
                                                backgroundColor: "#48c9a9", // Set the desired button background color
                                                color: "#fff",

                                            }}
                                        >
                                            {votingStatus[index] ? "Already Support" : "I support"}
                                        </ShimmerVoteButton>

                                    </CardActions>
                                </Card>
                            ))}
                        </Carousel>
                    </Stack>
                </Container>
            </Stack>

            <Container
                maxWidth="sm"
                sx={{
                    marginTop: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Add a Proposal</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>

                {isOwner && (
                    <Fab
                        color="primary"
                        aria-label="add"
                        style={{
                            position: "fixed", // Here we use fixed positioning
                            bottom: "1rem", // Offset from the bottom
                            right: "1rem", // Offset from the right
                            backgroundColor: "#48c9a9", // Set the desired button background color
                            color: "#fff"
                        }}
                        onClick={openDialog} // Add your own logic here
                    >
                        <AddIcon />
                    </Fab>

                )}

            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message={snackbarMessage}
                action={
                    <Button color="secondary" size="small" onClick={closeSnackbar}>
                        Close
                    </Button>
                }
            />
        </Container>
    );
}

export default VotingComponent;
