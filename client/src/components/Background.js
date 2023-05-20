import React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

const StyledContainer = styled(Container)`
  background-color: black;
  color: white;
`;

const VotingContainer = ({ children }) => {
    return <StyledContainer maxWidth={false} disableGutters>{children}</StyledContainer>;
};

export default VotingContainer;