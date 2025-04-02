import './Button.scss';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Is this button the default action? */
  isDefault?: boolean;
  /** Button contents */
  children: React.ReactNode;
}

/** Primary UI component for user interaction */
export const Button = ({
  isDefault = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={['btn', isDefault ? 'btn-default' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
