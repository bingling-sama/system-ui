'use client';

import React from 'react';

export interface MenuItemProps {
  /**
   * Menu item content
   */
  children: React.ReactNode;
  /**
   * Whether the menu item is disabled
   */
  disabled?: boolean;
  /**
   * Menu item href (for link items)
   */
  href?: string;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Whether this item has a dropdown
   */
  hasPopup?: boolean;
}

export default function MenuItem({
  children,
  disabled = false,
  href,
  className = '',
  hasPopup = false,
}: MenuItemProps) {
  const classes = [
    'menu-item',
    disabled ? 'menu-item--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = href ? (
    <a href={href} className="menu-item__link">
      {children}
    </a>
  ) : (
    children
  );

  return (
    <li
      role="menu-item"
      tabIndex={disabled ? -1 : 0}
      aria-haspopup={hasPopup}
      className={classes}
    >
      {content}
    </li>
  );
}
