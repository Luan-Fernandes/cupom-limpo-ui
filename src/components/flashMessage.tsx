import { Snackbar, Alert } from '@mui/material';
import React from 'react';

type FlashMessageProps = {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
};

export default function FlashMessage({
  open,
  message,
  severity = 'error',
  onClose,
  duration = 4000,
}: FlashMessageProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}