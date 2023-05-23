import React, { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import contractABI from "../contracts/VotingSystem.json";
import Container from "@mui/material/Container";
import ConnectedStatus from "./ConnectedStatus";
import Balance from "./Balance";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Carousel from "react-material-ui-carousel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ShimmerButton from "./ShimmerButton";
import { Box } from "@mui/material";
import { useSnackbar } from "../hooks/useSnackbar"
import { useDialog } from '../hooks/useDialog';

function VotingComponent() {
    const [contract, setContract] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [signerAddress, setSignerAddress] = useState(null);
    const [accountBalance, setAccountBalance] = useState("");
    const [votingStatus, setVotingStatus] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);

    const { snackbarOpen, snackbarMessage, openSnackbar, closeSnackbar } = useSnackbar();
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

        // Call refreshData on component mount
        refreshData();

        // Add listener for account changes
        window.ethereum.on("accountsChanged", function (accounts) {
            // Time to refresh the data when account changes
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
                setVotingStatus(updatedVotingStatus); // Update the votingStatus state

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
                        backgroundColor: "transparent",
                    }}
                >
                    <Box>
                        <ConnectedStatus
                            isConnected={isConnected}
                            signerAddress={signerAddress}
                        />
                    </Box>
                    {isConnected && <Balance accountBalance={accountBalance} />}
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
                            width: "50%",
                            height: "auto",
                            objectFit: "contain",
                            mt: 2, // margin-top using theme spacing
                            mb: 5, // margin-bottom using theme spacing
                        }}
                    />

                    {proposals.length === 0 ? (
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
                    ) : (
                        <Container
                            sx={{
                                overflow: "visible",
                                boxShadow: "0px 0px 20px 3px rgba(115, 202, 164, .6)",
                                margin: 0,
                                padding: "0 !important",
                                borderRadius: '8px',

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
                                            borderColor: theme => theme.palette.background.outline,
                                            width: "100%",
                                            m: 0, // Margin shorthand
                                            p: 0, // Padding shorthand
                                            boxSizing: "border-box",
                                            borderRadius: '8px',
                                            backgroundColor: theme => theme.palette.background.container,

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
                                                                color: theme => theme.palette.primary.remove,
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
                                                <Typography variant="h2" sx={{ color: "#fc9847", marginLeft: "5px", fontSize: "15px" }}>
                                                    {proposal.voteCount.toString()}
                                                </Typography>
                                            </Box>

                                            <ShimmerButton
                                                variant="contained"
                                                onClick={() => vote(index)}
                                                disabled={votingStatus[index]}
                                            >
                                                {votingStatus[index] ? (
                                                    <Typography sx={{ color: (theme) => theme.palette.primary.disabled }}>
                                                        Already Voted
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{ color: (theme) => theme.palette.primary.contrastText }}> {/* change color or any other props as per your requirement */}
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
                    <DialogTitle sx={{
                        backgroundColor: (theme) => theme.palette.background.container
                    }}>
                        <Typography variant="body">Add a Proposal</Typography>
                    </DialogTitle>
                    <DialogContent sx={{
                        backgroundColor: (theme) => theme.palette.background.container
                    }}>
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
                                label: { color: (theme) => theme.typography.body.color },
                                '& .MuiInput-underline:before': {
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
                                label: { color: (theme) => theme.typography.body.color },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: (theme) => theme.typography.body.color,
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{
                        backgroundColor: (theme) => theme.palette.background.container
                    }}>
                        <Button onClick={() => closeDialog()}>Cancel</Button>
                        <Button onClick={handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>

                {isOwner && (
                    <Fab
                        aria-label="add"
                        sx={{
                            position: "fixed", // Here we use fixed positioning
                            bottom: "1rem", // Offset from the bottom
                            right: "1rem", // Offset from the right
                            backgroundColor: theme => theme.palette.primary.light,
                            color: theme => theme.palette.primary.contrastText,
                        }}
                        onClick={openDialog} // Add your own logic here
                    >
                        <AddIcon />
                    </Fab>
                )}
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
