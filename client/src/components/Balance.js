import React from 'react';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';

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
                sx={{
                    color: 'white',
                    backgroundColor: alpha('#00FF00', 1),
                }}
            />
        </div>
    );
}

export default Balance;