import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  size?: 'small' | 'medium' | 'large';
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  variant = 'contained',
  size = 'medium',
  ...props 
}) => {
  // Ajustes de padding baseados no tamanho
  const paddingMap = {
    small: '6px 12px',
    medium: '8px 16px',
    large: '10px 24px'
  };

  return (
    <Button 
      variant={variant}
      sx={{ 
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: variant === 'contained' ? 2 : 0,
        padding: paddingMap[size],
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;