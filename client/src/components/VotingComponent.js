import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import contractABI from '../contracts/VotingSystem.json';

function VotingComponent() {
    const [contract, setContract] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        async function initialize() {
            const provider = new ethers.BrowserProvider(window.ethereum);

            if (provider) {
                try {
                    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const signer = await provider.getSigner();
                    setSigner(signer);
                    const contract = new Contract('0x8d5382929635594A2e84E8a233C3d50fD4432D26', contractABI.abi, signer);
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
        if (contract && newTitle !== '' && newDescription !== '') {
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
        } else {
            alert('Please enter both title and description');
        }
    }


    async function vote(proposalId) {

        if (contract) {
            try {

                const signerAddress = await signer.getAddress();

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
            <h1>Voting Component</h1>

            {/* Connection status */}
            {isConnected ? (
                <p>Connected to MetaMask</p>
            ) : (
                <p>Not connected to MetaMask</p>
            )}

            {/* Input field for new proposal */}
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
