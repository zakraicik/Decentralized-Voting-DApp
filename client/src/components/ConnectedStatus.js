import React from 'react';
import TimelineDot from '@mui/lab/TimelineDot';

function ConnectedStatus({ isConnected }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {isConnected ? (
                <>
                    <TimelineDot sx={{ width: '5px', height: '5px', backgroundColor: '#4caf50' }} />
                    <p style={{ margin: '0', marginLeft: '8px', color: '#4caf50', fontWeight: 'bold', fontSize: '14px', lineHeight: '1' }}>CONNECTED</p>
                </>
            ) : (
                <p>Not connected to MetaMask</p>
            )}
        </div>
    );
}

export default ConnectedStatus;