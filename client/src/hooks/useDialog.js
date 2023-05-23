import { useState } from 'react';

export const useDialog = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return { dialogOpen, openDialog, closeDialog };
};