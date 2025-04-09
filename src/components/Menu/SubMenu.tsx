'use client';

import React, { useState } from 'react';

export interface SubMenuProps {
  /**
   * SubMenu title
   */
  title: string;
  /**
   * SubMenu children
   */
  children: React.ReactNode;
  /**
   * Whether the submenu is disabled
   */
  disabled?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

export default function SubMenu({
  title,
  children,
  disabled = false,
  className = '',
}: SubMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
      e.preventDefault();
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
      e.preventDefault();
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      e.preventDefault();
    }
  };

  const classes = [
    'menu-item',
    'submenu',
    isOpen ? 'submenu--open' : '',
    disabled ? 'menu-item--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      role="menu-item"
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="true"
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {title}
      {isOpen && (
        <ul role="menu" className="submenu__dropdown">
          {children}
        </ul>
      )}
    </li>
  );
}
