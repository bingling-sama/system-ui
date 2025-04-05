'use client';

import { useState } from 'react';
import checkmarkIcon from '../../assets/icon/checkmark.svg';
import './Alert.scss';

export type AlertType = 'success' | 'default' | 'danger' | 'warning';

export interface AlertProps {
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert description
   */
  description?: string;
  /**
   * Alert type
   */
  type?: AlertType;
  /**
   * Callback when alert is closed
   */
  onClose?: () => void;
  /**
   * Whether the alert can be closed
   */
  closable?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

export default function Alert({
  title,
  description,
  type = 'default',
  onClose,
  closable = true,
  className = '',
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={`alert alert--${type} ${className}`}>
      <div className="alert__title-bar">
        <div className="alert__title-text">
          {title || `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`}
        </div>
        {closable && (
          <button
            className="alert__close-button"
            onClick={handleClose}
            aria-label="Close alert"
          >
            <img src={checkmarkIcon} alt="Close" width={12} height={12} />
          </button>
        )}
      </div>
      <div className="alert__body">
        {description || title || 'This is an alert!'}
      </div>
    </div>
  );
}
