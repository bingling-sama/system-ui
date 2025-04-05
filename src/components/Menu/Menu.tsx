import React, { useState, useRef, useEffect } from 'react';
import './Menu.scss';

export interface MenuProps {
  children?: React.ReactNode;
  title: string;
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

export const Menu: React.FC<MenuProps> = ({ children, title }) => {
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

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <MenuContext.Provider value={{ closeMenu }}>
      <li
        ref={menuRef}
        role="menu-item"
        aria-haspopup="true"
        className={isOpen ? 'active' : ''}
      >
        <div
          className="menu-title"
          onClick={handleTitleClick}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {title}
        </div>
        {isOpen && <ul role="menu">{children}</ul>}
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
    <li role="menuitem">
      <button
        onClick={handleClick}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {children}
      </button>
    </li>
  );
};
