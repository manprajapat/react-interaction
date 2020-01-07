import * as React from 'react';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Dialog.style.css';
import { NoticeOptions } from '../Notice';
import { InquiryOptions } from '../Inquiry';
import { EventHandler } from '../../lib/EventHandler';

interface DialogProps extends NoticeOptions, InquiryOptions {
  onClose: (flag?: boolean) => void;
  message: ReactNode;
}

const KEYPRESS_EVENT_NAME = 'keydown.dialog';

const Dialog: React.FC<DialogProps> = ({
  message,
  onClose,
  dimmedClassName = '',
  dimmedStyle,
  contentClassName = '',
  contentStyle,
  messageStyle,
  okClassName = '',
  okStyle,
  okText,
  // cancelClassName = '',
  // cancelStyle,
  cancelText,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const flag = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    EventHandler.addEventListener(KEYPRESS_EVENT_NAME, (e) => {
      if (e.code === 'Escape') {
        handleClose(false);
      }
    });

    return () => {
      EventHandler.removeEventListener(KEYPRESS_EVENT_NAME);
    }
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 0);
  }, []);

  const handleClose = (isConfirmed: boolean) => {
    flag.current = isConfirmed;
    setActive(false);
  };

  const handleTransitionEnd = () => {
    if (!active) {
      onClose(flag.current);
    }
  };

  return (
    <div
      className={`${styles['dialog']} ${dimmedClassName} ${
        active ? styles['active'] : ''
      }`}
      style={dimmedStyle}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className={`${styles['dialog-content']} ${contentClassName}`}
        style={contentStyle}
      >
        <div className={styles['dialog-message']} style={messageStyle}>
          {message}
        </div>
        <div className={styles['dialog-button-wrap']}>
          {cancelText && (
            <button
              autoFocus
              type="button"
              className={`${styles['dialog-button-cancel']} ${okClassName}`}
              style={okStyle}
              onClick={() => handleClose(false)}
            >
              {cancelText}
            </button>
          )}
          {okText && (
            <button
              autoFocus
              type="button"
              className={`${styles['dialog-button-ok']} ${okClassName}`}
              style={okStyle}
              onClick={() => handleClose(true)}
            >
              {okText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
