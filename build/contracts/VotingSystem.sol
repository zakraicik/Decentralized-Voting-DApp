pragma solidity ^0.8.0;

contract VotingSystem {
    struct Proposal {
        string title;
        string description;
        uint voteCount;
    }

    Proposal[] public proposals;

    mapping(uint => mapping(address => bool)) public hasVoted;
    address public owner;

    event ProposalCreated(uint proposalIndex, string title, string description);
    event Voted(uint proposalIndex, address voter);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    modifier proposalExists(uint proposalIndex) {
        require(proposalIndex < proposals.length, "Proposal does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProposal(
        string memory title,
        string memory description
    ) public onlyOwner {
        proposals.push(
            Proposal({title: title, description: description, voteCount: 0})
        );
        emit ProposalCreated(proposals.length - 1, title, description);
    }

    function vote(uint proposalIndex) public proposalExists(proposalIndex) {
        require(
            !hasVoted[proposalIndex][msg.sender],
            "You have already voted on this proposal"
        );
        proposals[proposalIndex].voteCount++;
        hasVoted[proposalIndex][msg.sender] = true;
        emit Voted(proposalIndex, msg.sender);
    }

    function getProposal(
        uint proposalIndex
    )
        public
        view
        proposalExists(proposalIndex)
        returns (string memory title, string memory description, uint voteCount)
    {
        return (
            proposals[proposalIndex].title,
            proposals[proposalIndex].description,
            proposals[proposalIndex].voteCount
        );
    }

    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }
}
