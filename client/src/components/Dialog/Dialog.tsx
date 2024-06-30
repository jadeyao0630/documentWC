import React, { FC, ReactNode } from 'react';
import Button from '../Button/button';
import Icon from '../Icon/icon';

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
          <div className='dialog-title'><Icon icon={"info-circle"} style={{marginRight:5,color:'green'}}></Icon>{title}</div>
        </div>
        <div className="dialog-content">
            <p>{message}</p>
            <Button onClick={onConfirm} style={{marginRight:10,marginBottom:5,width:100}} btnType="blue">确认</Button>
            <Button onClick={onCancel} style={{marginBottom:5,width:100}} >取消</Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;