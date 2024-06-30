import React, { FC, useState, useEffect } from 'react';

interface MessageBoxProps {
  message: string;
  type?: 'success' | 'error' | 'info'; // 消息类型
  duration?: number; // 自动隐藏时间（毫秒）
  onClose?: () => void; // 关闭消息框的回调函数
}

const MessageBox: FC<MessageBoxProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`message-box message-box--${type}`}>
      <span>{message}</span>
      <button className="message-box__close" onClick={() => setVisible(false)}>
        &times;
      </button>
    </div>
  );
};

export default MessageBox;