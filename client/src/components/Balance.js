import React from 'react';
import Chip from '@mui/material/Chip';

function Balance({ accountBalance }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Chip
                label={`${Number(accountBalance).toFixed(2)} ETH`}
                size="small"
            />
        </div>
    );
}

export default Balance;