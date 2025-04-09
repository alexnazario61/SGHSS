import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

type NotificationType = {
  message: string;
  severity: AlertColor;
  open: boolean;
};

type NotificationContextType = {
  showNotification: (message: string, severity: AlertColor) => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  hideNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationType>({
    message: '',
    severity: 'info',
    open: false,
  });

  const showNotification = (message: string, severity: AlertColor = 'info') => {
    setNotification({
      message,
      severity,
      open: true,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Auto-hide notification after 6 seconds
  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification.open]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};