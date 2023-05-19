#!/bin/sh

# Compile the contracts
npx truffle compile

# Create the src/contracts directory if it doesn't exist
mkdir -p client/src/contracts

# Copy only the VotingSystem.json contract into src/contracts
cp build/contracts/VotingSystem.json client/src/contracts/
