'use client';

import React from 'react';
import './Menu.scss';

export interface MenuProps {
  /**
   * Menu children
   */
  children: React.ReactNode;
  /**
   * Additional class names
   */
  className?: string;
}

export default function Menu({ children, className = '' }: MenuProps) {
  return (
    <ul role="menu-bar" className={`menu ${className}`}>
      {children}
    </ul>
  );
}
