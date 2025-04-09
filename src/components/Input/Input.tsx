'use client';

import React, { ChangeEvent, InputHTMLAttributes, forwardRef } from 'react';
import './Input.scss';

export type InputSize = 'lg' | 'sm';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * Input size
   */
  size?: InputSize;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Input prefix
   */
  prefix?: React.ReactNode;
  /**
   * Input suffix
   */
  suffix?: React.ReactNode;
  /**
   * Callback when input value changes
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Input component for user text input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      disabled = false,
      prefix,
      suffix,
      className = '',
      style,
      ...restProps
    },
    ref
  ) => {
    const classes = [
      'input-wrapper',
      size ? `input-size-${size}` : '',
      disabled ? 'is-disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes} style={style}>
        {prefix && <div className="input-prefix">{prefix}</div>}
        <input
          className="input-inner"
          disabled={disabled}
          ref={ref}
          {...restProps}
        />
        {suffix && <div className="input-suffix">{suffix}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
