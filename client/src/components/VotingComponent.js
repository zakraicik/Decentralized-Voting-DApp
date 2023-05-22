import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import contractABI from '../contracts/VotingSystem.json';
import Container from '@mui/material/Container';
import ConnectedStatus from './ConnectedStatus';
import Balance from './Balance';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';



const StyledSpeedDial = styled(SpeedDial)({
    position: 'fixed',
    bottom: '16px',
    right: '16px',

});



function VotingComponent() {
    const [contract, setContract] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [signerAddress, setSignerAddress] = useState(null);
    const [accountBalance, setAccountBalance] = useState('');
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [votingStatus, setVotingStatus] = useState({});


    const handleSpeedDialOpen = () => setIsSpeedDialOpen(true);
    const handleSpeedDialClose = () => setIsSpeedDialOpen(false);

    const openDialog = () => {
        if (proposals.length >= 2) {
            openSnackbar('Maximum of 2 proposals can be added at a time.');
        } else {
            handleSpeedDialClose();
            setDialogOpen(true);
        }
    };

    const handleAdd = () => {
        addProposal();
        setDialogOpen(false);
    };

    const handleRemove = () => {
        removeProposal();
    };

    const openSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const actions = [
        { icon: <SaveIcon />, name: 'Add Proposal', onClick: openDialog },
        ...(proposals.length > 0 ? [{ icon: <DeleteIcon />, name: 'Remove Proposal', onClick: handleRemove }] : []),
    ];

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

                    const contract = new Contract('0x6567c84fDf23c0a54585320a9a9048EA8a45eB37', contractABI.abi, signer);
                    const owner = await contract.owner();

                    setIsOwner(signerAddress === owner);
                    setContract(contract);

                    const count = await contract.getProposalsCount();
                    const proposals = [];
                    const votingStatus = {};
                    for (let i = 0; i < count; i++) {
                        const proposal = await contract.getProposal(i);
                        proposals.push(proposal);
                        const hasUserVotedForProposal = await contract.hasVoted(i, signerAddress);
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
                console.error('Please install MetaMask!');
                setIsConnected(false);
            }
        }
        initialize();
    }, []);

    async function addProposal() {
        if (contract && newTitle !== '' && newDescription !== '' && isOwner) {

            try {
                const tx = await contract.createProposal(newTitle, newDescription);
                await tx.wait();
                openSnackbar('Proposal added successfully!');
                setNewTitle('');
                setNewDescription('');

                const count = await contract.getProposalsCount();
                const proposals = [];
                for (let i = 0; i < count; i++) {
                    const proposal = await contract.getProposal(i);
                    proposals.push(proposal);
                }
                setProposals(proposals);
                setIsSpeedDialOpen(false);

            } catch (err) {
                console.error('Error adding proposal:', err);
            }
        } else if (!isOwner) {
            openSnackbar("Only owners can add proposals")
        }
        else {
            openSnackbar('Please enter both title and description');
        }


    }

    async function removeProposal(proposalIndex) {
        if (contract && isOwner) {
            try {
                const tx = await contract.removeProposal(proposalIndex);
                await tx.wait();
                openSnackbar('Proposal removed successfully!');

                const count = await contract.getProposalsCount();
                const updatedProposals = [];
                const updatedVotingStatus = {};

                for (let i = 0; i < count; i++) {
                    const proposal = await contract.getProposal(i);
                    updatedProposals.push(proposal);
                    const hasUserVotedForProposal = await contract.hasVoted(i, signerAddress);
                    updatedVotingStatus[i] = hasUserVotedForProposal;
                }

                setProposals(updatedProposals);
                setVotingStatus(updatedVotingStatus); // Update the votingStatus state
                setIsSpeedDialOpen(false);
            } catch (err) {
                console.error('Error removing proposal:', err);
            }
        } else if (!isOwner) {
            openSnackbar('Only owners can remove proposals');
        }
    }


    async function vote(proposalId) {
        if (contract) {
            try {
                const hasUserVotedForProposal = await contract.hasVoted(proposalId, signerAddress);

                if (!hasUserVotedForProposal) {
                    const tx = await contract.vote(proposalId);

                    await tx.wait();

                    // Update the votingStatus state to reflect the new vote
                    setVotingStatus(prevVotingStatus => ({
                        ...prevVotingStatus,
                        [proposalId]: true
                    }));

                    openSnackbar('Vote cast successfully!');
                    const count = await contract.getProposalsCount();
                    const proposals = [];
                    for (let i = 0; i < count; i++) {
                        const proposal = await contract.getProposal(i);
                        proposals.push(proposal);
                    }
                    setProposals(proposals);
                } else {
                    openSnackbar("Already voted.")
                }
            } catch (err) {
                console.error('Error casting vote:', err);
            }
        }
    }

    return (
        <Container maxWidth={false} >
            <Stack>
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 9999,
                        backgroundColor: 'transparent', // This will make the div's background transparent
                    }}
                >
                    <ConnectedStatus isConnected={isConnected} signerAddress={signerAddress} />
                    <Balance accountBalance={accountBalance} />
                </div>


                <Container
                    maxWidth="sm"
                    sx={{
                        marginTop: '80px',
                    }}
                >
                    <img src="/logo.png" alt="Your Logo" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%', height: 'auto', objectFit: 'contain', marginTop: '20px', marginBottom: '50px' }} />

                    <Stack spacing={2} >

                        {proposals.map((proposal, index) => (
                            <Accordion key={index} style={{
                                background: '#fff',
                                color: '#73caa4',

                                borderRadius: `10px`,

                                fontFamily: 'Roboto, sans-serif',

                            }}>
                                <AccordionSummary sx={{
                                    background: "#3a3e45",
                                    borderRadius: '10px',
                                }}>
                                    <Typography variant="h6"> {proposal.title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <Typography variant="body1">Description: {proposal.description}</Typography>
                                            <Typography variant="body1">Vote count: {proposal.voteCount.toString()}</Typography>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => vote(index)}
                                                disabled={votingStatus[index]}
                                            >
                                                {votingStatus[index] ? "Already Voted" : "Vote for this proposal"}
                                            </Button>
                                            {isOwner && (
                                                <IconButton
                                                    color="#3a3e45"
                                                    onClick={() => removeProposal(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                </Container>
            </Stack>

            <Container
                maxWidth="sm"
                sx={{
                    marginTop: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
                            onChange={e => setNewTitle(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd}>Add</Button>
                    </DialogActions>
                </Dialog>

                {isOwner && (



                    <StyledSpeedDial
                        ariaLabel="SpeedDial"
                        icon={<SpeedDialIcon />}
                        onClose={handleSpeedDialClose}
                        onOpen={handleSpeedDialOpen}
                        open={isSpeedDialOpen}
                        direction="up"
                        FabProps={{
                            style: {
                                backgroundColor: '#73caa4', // Set the desired button background color
                            },
                        }}

                    >
                        {
                            actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={action.onClick}
                                />
                            ))
                        }
                    </StyledSpeedDial>
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
        </Container >
    );
}

export default VotingComponent;