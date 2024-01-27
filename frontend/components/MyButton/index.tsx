import React from 'react';
import { Button } from 'antd';

interface MyButtonProps {
  buttonText: string;
  onClick: (value: string) => void;
  selected: boolean;
}

const MyButton: React.FC<MyButtonProps> = ({ buttonText, onClick, selected }) => {
  const textBg = selected ? '#6BFEC9' : '#434154';
  const textColor = selected ? '#3D3D3D' : 'white';

  const handleClick = () => {
    onClick(buttonText);
  };

  return (
    <Button
      style={{ color: textColor, background: textBg, border: 'none' }}
      shape="round"
      onClick={handleClick}
      size="large"
    >
      {buttonText}
    </Button>
  );
};

export default MyButton;
