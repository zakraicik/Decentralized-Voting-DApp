import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import contractABI from '../contracts/VotingSystem.json';


function VotingComponent() {
    const [contract, setContract] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [newProposal, setNewProposal] = useState("");

    useEffect(() => {
        async function initialize() {
            if (window.ethereum) {
                try {
                    await window.ethereum.enable();
                    const provider = new ethers.BrowserProvider(window.ethereum);

                    const signer = provider.getSigner();
                    const contract = new Contract('0xc77295e193a5f7a96313a8E760F319cF698965f0', contractABI.abi, signer);
                    setContract(contract);

                    const count = await contract.getProposalsCount();
                    const proposals = [];
                    for (let i = 0; i < count; i++) {
                        const proposal = await contract.getProposal(i);
                        proposals.push(proposal);
                    }
                    setProposals(proposals);
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.error('Please install MetaMask!');
            }
        }
        initialize();
    }, []);

    async function vote(proposalId) {
        if (contract) {
            try {
                const tx = await contract.vote(proposalId);
                await tx.wait();
                alert('Vote cast successfully!');
                // Re-fetch proposals after voting
                const count = await contract.getProposalsCount();
                const proposals = [];
                for (let i = 0; i < count; i++) {
                    const proposal = await contract.getProposal(i);
                    proposals.push(proposal);
                }
                setProposals(proposals);
            } catch (err) {
                console.error('Error casting vote:', err);
            }
        }
    }

    async function addProposal() {
        if (contract && newProposal !== "") {
            try {
                const tx = await contract.createProposal(newProposal);
                await tx.wait();
                alert('Proposal added successfully!');
                setNewProposal(""); // Clear the input field after adding proposal

                // Re-fetch proposals after adding
                const count = await contract.getProposalsCount();
                const proposals = [];
                for (let i = 0; i < count; i++) {
                    const proposal = await contract.getProposal(i);
                    proposals.push(proposal);
                }
                setProposals(proposals);
            } catch (err) {
                console.error('Error adding proposal:', err);
            }
        }
    }

    return (
        <div>
            <h1>Voting Component</h1>

            {/* Input field for new proposal */}
            <div>
                <input
                    type="text"
                    value={newProposal}
                    onChange={(e) => setNewProposal(e.target.value)}
                    placeholder="Enter new proposal description"
                />
                <button onClick={addProposal}>Add Proposal</button>
            </div>

            {/* Display proposals */}
            {proposals.map((proposal, index) => (
                <div key={index}>
                    <h2>Proposal {index + 1}</h2>
                    <p>Description: {proposal.description}</p>
                    <p>Vote count: {proposal.voteCount}</p>
                    <button onClick={() => vote(index)}>Vote for this proposal</button>
                </div>
            ))}
        </div>
    );
}

export default VotingComponent;
