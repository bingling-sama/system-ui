import React, { useState, useRef, useEffect } from 'react';
import './Menu.scss';

export interface MenuProps {
  children?: React.ReactNode;
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface MenuItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export const MenuContext = React.createContext<{
  closeMenu?: () => void;
}>({});

export const Menu: React.FC<MenuProps> = ({
  children,
  title,
  className,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <MenuContext.Provider value={{ closeMenu }}>
      <li ref={menuRef} role="menu-item" className={isOpen ? 'active' : ''}>
        <span className="menu-title" onClick={handleMenuClick}>
          {title}
        </span>
        {isOpen && (
          <ul
            className={`${className || ''}`}
            style={style}
            role="menu"
            onClick={e => e.stopPropagation()}
          >
            {children}
          </ul>
        )}
      </li>
    </MenuContext.Provider>
  );
};

export const MenuBar: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return <ul role="menu-bar">{children}</ul>;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  disabled,
  divider,
}) => {
  const { closeMenu } = React.useContext(MenuContext);

  if (divider) {
    return <li role="separator" className="divider" />;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onClick) {
      onClick();
      closeMenu?.();
    }
  };

  return (
    <li role="menu-item" className={disabled ? 'disabled' : ''}>
      <span className="menu-title" onClick={handleClick}>
        {children}
      </span>
    </li>
  );
};
