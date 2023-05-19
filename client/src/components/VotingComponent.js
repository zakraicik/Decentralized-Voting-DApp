import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import contractABI from '../contracts/VotingSystem.json';
import Chip from '@mui/material/Chip';

import TimelineDot from '@mui/lab/TimelineDot';

import { styled } from '@mui/material/styles';

const SuccessChip = styled(Chip)({
    backgroundColor: '#4caf50',
    color: '#fff',
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

                    const contract = new Contract('0x8d5382929635594A2e84E8a233C3d50fD4432D26', contractABI.abi, signer);
                    const owner = await contract.owner();

                    setIsOwner(signerAddress === owner);
                    setContract(contract);

                    const count = await contract.getProposalsCount();
                    const proposals = [];
                    for (let i = 0; i < count; i++) {
                        const proposal = await contract.getProposal(i);
                        proposals.push(proposal);
                    }
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
                alert('Proposal added successfully!');
                setNewTitle('');
                setNewDescription('');

                const count = await contract.getProposalsCount();
                const proposals = [];
                for (let i = 0; i < count; i++) {
                    const proposal = await contract.getProposal(i);
                    proposals.push(proposal);
                }
                setProposals(proposals);
                console.log(count);
            } catch (err) {
                console.error('Error adding proposal:', err);
            }
        } else if (!isOwner) {
            alert("Only owners can add proposals")
        }
        else {
            alert('Please enter both title and description');
        }
    }


    async function vote(proposalId) {

        if (contract) {
            try {

                const hasUserVotedForProposal = await contract.hasVoted(proposalId, signerAddress);


                if (!hasUserVotedForProposal) {

                    const tx = await contract.vote(proposalId);

                    await tx.wait();

                    alert('Vote cast successfully!');
                    const count = await contract.getProposalsCount();
                    const proposals = [];
                    for (let i = 0; i < count; i++) {
                        const proposal = await contract.getProposal(i);
                        proposals.push(proposal);
                    }
                    setProposals(proposals);

                } else {
                    alert("Already voted.")
                }



            } catch (err) {
                console.error('Error casting vote:', err);
            }
        }
    }

    return (
        <div>
            {isConnected ? (
                <div style={{ position: 'fixed', top: '20px', left: '20px', padding: '10px', display: 'flex', alignItems: 'center' }}>
                    <TimelineDot sx={{ width: '5px', height: '5px', backgroundColor: '#4caf50' }} />
                    <p style={{ marginLeft: '5px', color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>CONNECTED</p>
                </div>
            ) : (
                <p>Not connected to MetaMask</p>
            )}

            {/* Owner status */}
            {isOwner ? (
                <p>Owner</p>
            ) : (
                <p>Not Owner</p>
            )}


            {/* Input field for new proposal */}
            {isOwner && (
                <div>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter new proposal title"
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Enter new proposal description"
                    />
                    <button onClick={addProposal}>Add Proposal</button>
                </div>
            )}

            {/* Display proposals */}
            {proposals.map((proposal, index) => (
                <div key={index}>
                    <h2>Proposal {proposal.title}</h2>
                    <p>Description: {proposal.description}</p>
                    <p>Vote count: {proposal.voteCount.toString()}</p>
                    <button onClick={() => vote(index)}>Vote for this proposal</button>
                </div>
            ))}
        </div>
    );
}

export default VotingComponent;
