const VotingSystem = artifacts.require('VotingSystem');

contract('VotingSystem', (accounts) => {
    let votingSystem = null;
    const owner = accounts[0];
    const voter = accounts[1];

    before(async () => {
        votingSystem = await VotingSystem.deployed();
    });

    it('Should create a new proposal', async () => {
        await votingSystem.createProposal('Title 1', 'Description 1', { from: owner });
        await votingSystem.createProposal('Title 2', 'Description 2', { from: owner });
        const proposal1 = await votingSystem.getProposal(0);
        const proposal2 = await votingSystem.getProposal(1);
        assert(proposal1.title === 'Title 1');
        assert(proposal1.description === 'Description 1');
        assert(proposal1.voteCount.toNumber() === 0);
        assert(proposal2.title === 'Title 2');
        assert(proposal2.description === 'Description 2');
        assert(proposal2.voteCount.toNumber() === 0);
    });

    it('Should NOT create a new proposal if not owner', async () => {
        try {
            await votingSystem.createProposal('Title 2', 'Description 2', { from: voter });
        } catch (e) {
            assert(e.message.includes('Only the contract owner can call this function'));
            return;
        }
        assert(fsalse);
    });

    it('Should increment the vote count', async () => {
        await votingSystem.vote(0, { from: voter });
        const proposal = await votingSystem.getProposal(0);
        assert(proposal.voteCount.toNumber() === 1);
    });

    it('Should NOT allow a user to vote twice on a proposal', async () => {
        try {
            await votingSystem.vote(0, { from: voter });
        } catch (e) {
            assert(e.message.includes('You have already voted on this proposal'));
            return;
        }
        assert(false);
    });

    it('Should NOT vote if proposal does not exist', async () => {
        try {
            await votingSystem.vote(100, { from: voter });
        } catch (e) {
            assert(e.message.includes('Proposal does not exist'));
            return;
        }
        assert(false);
    });

    it('Should reassign hasVoted mappings when a proposal is removed', async () => {
        await votingSystem.createProposal('Title Y', 'Description A', { from: owner });
        await votingSystem.createProposal('Title Z', 'Description B', { from: owner });

        const countBN = await votingSystem.getProposalsCount();
        const count = countBN.toNumber();

        const voter2 = accounts[2];

        await votingSystem.vote(2, { from: owner });

        await votingSystem.vote(3, { from: voter2 });

        await votingSystem.removeProposal(2, { from: owner });

        const new_countBN = await votingSystem.getProposalsCount();
        const new_count = new_countBN.toNumber();

        await votingSystem.vote(2, { from: owner });

        const proposal = await votingSystem.getProposal(2);

        assert(count - 1 === new_count)
        assert(proposal.voteCount.toNumber() === 2);

    });
});