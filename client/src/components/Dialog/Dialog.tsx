import React, { FC, ReactNode } from 'react';
import Button from '../Button/button';

interface DialogProps {
  title: string;
  message:string|null;
  onConfirm: () => void;
  onCancel: () => void;
}

const Dialog: FC<DialogProps> = ({ title, message, onConfirm, onCancel }) => {

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <div>{title}</div>
        </div>
        <div className="dialog-content">
            <p>{message}</p>
            <Button onClick={onConfirm} style={{marginRight:10}} btnType="blue">确认</Button>
            <Button onClick={onCancel}>取消</Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;