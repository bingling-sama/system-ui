'use client';

import React, { ReactNode, useContext, memo } from 'react';
import { FormContext } from './context';
import Input from '../Input';

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  help?: string;
}

export const FormItem: React.FC<FormItemProps> = ({
  name,
  label,
  required = false,
  children,
  className = '',
  help,
  style,
  ...restProps
}) => {
  const formContext = useContext(FormContext);
  const { layout } = formContext;
  const errors = formContext.getFieldErrors(name);
  const hasError = errors.length > 0;
  const value = formContext.getFieldValue(name);

  // 使用useMemo缓存样式对象
  const itemStyle = React.useMemo<React.CSSProperties>(
    () => ({
      display: 'flex',
      flexDirection: layout === 'horizontal' ? 'row' : 'column',
      ...style,
    }),
    [layout, style]
  );

  const labelStyle = React.useMemo<React.CSSProperties>(
    () => ({
      flex: layout === 'horizontal' ? '0 0 80px' : 'none',
      textAlign: layout === 'horizontal' ? 'right' : 'left',
      marginRight: layout === 'horizontal' ? '8px' : '0',
      marginBottom: layout === 'vertical' ? '8px' : '0',
    }),
    [layout]
  );

  const contentStyle = React.useMemo<React.CSSProperties>(
    () => ({
      flex: 1,
    }),
    []
  );

  const handleValueChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const newValue = e.target.value;
      formContext.setFieldValue(name, newValue);
    },
    [formContext, name]
  );

  const childElement = React.useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        const childProps = child.props as {
          value?: unknown;
          onChange?: (
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => void;
        };
        if (
          child.type === Input ||
          ['input', 'select', 'textarea'].includes(String(child.type)) ||
          'value' in childProps ||
          'onChange' in childProps
        ) {
          return React.cloneElement(
            child as React.ReactElement<{
              value: unknown;
              onChange: (
                e: React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
              ) => void;
            }>,
            {
              value: value ?? '',
              onChange: event => {
                handleValueChange(event);
                childProps.onChange?.(event);
              },
            }
          );
        }
        return child;
      }
      return child;
    });
  }, [children, value, handleValueChange]);

  const classes =
    `viking-form-item ${hasError ? 'viking-form-item-error' : ''} ${className}`.trim();

  return (
    <div className={classes} style={itemStyle} {...restProps}>
      {label && (
        <label className="viking-form-item-label" style={labelStyle}>
          {required && <span className="viking-form-item-required">*</span>}
          {label}
        </label>
      )}
      <div className="viking-form-item-control" style={contentStyle}>
        {childElement}
        {hasError && (
          <div className="viking-form-item-error-help">
            {errors.map((error, index) => (
              <div key={index} className="viking-form-item-error-text">
                {error}
              </div>
            ))}
          </div>
        )}
        {help && <div className="viking-form-item-help">{help}</div>}
      </div>
    </div>
  );
};

FormItem.displayName = 'FormItem';

export default memo(FormItem);
