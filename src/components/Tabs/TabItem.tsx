'use client';

import React, { useContext } from 'react';
import { TabsContext } from './TabContext';

export interface TabItemProps {
  /**
   * Tab item key
   */
  itemKey: string;
  /**
   * Tab label
   */
  tab: React.ReactNode;
  /**
   * Tab content
   */
  children: React.ReactNode;
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

export default function TabItem({
  itemKey,
  tab,
  disabled = false,
  className = '',
}: TabItemProps) {
  const { activeKey, onSelect } = useContext(TabsContext);
  const isActive = activeKey === itemKey;

  const handleClick = () => {
    if (!disabled) {
      onSelect(itemKey);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(itemKey);
      e.preventDefault();
    }
  };

  const classes = [
    'tabs-nav-item',
    isActive ? 'tabs-nav-item--active' : '',
    disabled ? 'tabs-nav-item--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      role="tab"
      tabIndex={disabled ? -1 : 0}
      aria-selected={isActive}
      aria-disabled={disabled}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {tab}
    </li>
  );
}
