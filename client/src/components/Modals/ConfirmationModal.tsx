import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  content: string;
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
  content,
}) => {
  return (
    <Dialog open={open} onClose={acceptAction}>
      <DialogTitle sx={{ textAlign: 'center' }}>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
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
