import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  acceptTitle: string;
  cancelAction: () => void;
  acceptAction: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  cancelAction,
  acceptAction,
  acceptTitle,
  title,
}) => {
  return (
    <Dialog open={open} onClose={acceptAction}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={cancelAction} color='primary'>
          Отмена
        </Button>
        <Button onClick={acceptAction} color='primary'>
          {acceptTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
