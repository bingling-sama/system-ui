'use client';

import React, { useState, ReactElement, isValidElement } from 'react';
import './Tabs.scss';
import { TabsContext, TabsContextProps } from './TabContext';
import { TabItemProps } from './TabItem';

export interface TabsProps {
  /**
   * Default active tab key
   */
  defaultActiveKey?: string;
  /**
   * Callback when tab is selected
   */
  onSelect?: (key: string) => void;
  /**
   * Tabs children
   */
  children: React.ReactNode;
  /**
   * Additional class names
   */
  className?: string;
}

type TabItemElement = ReactElement<TabItemProps>;
type FragmentElement = ReactElement<{ children: React.ReactNode }>;

function isTabItemElement(element: React.ReactNode): element is TabItemElement {
  if (!isValidElement(element)) return false;
  const props = element.props as Partial<TabItemProps>;
  return props.tab !== undefined && props.itemKey !== undefined;
}

function isFragmentElement(
  element: React.ReactNode
): element is FragmentElement {
  return isValidElement(element) && element.type === React.Fragment;
}

function renderTabNav(child: React.ReactNode): React.ReactNode {
  if (isFragmentElement(child)) {
    return React.Children.map(child.props.children, renderTabNav);
  }

  if (isTabItemElement(child)) {
    return React.cloneElement(child, {
      key: child.props.itemKey,
    });
  }

  return null;
}

function renderTabContent(
  child: React.ReactNode,
  activeKey: string
): React.ReactNode {
  if (isFragmentElement(child)) {
    return React.Children.map(child.props.children, nestedChild =>
      renderTabContent(nestedChild, activeKey)
    );
  }

  if (isTabItemElement(child) && child.props.itemKey === activeKey) {
    return child.props.children;
  }

  return null;
}

export default function Tabs({
  defaultActiveKey,
  onSelect,
  children,
  className = '',
}: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || '');

  const handleSelect = (key: string) => {
    setActiveKey(key);
    onSelect?.(key);
  };

  const contextValue: TabsContextProps = {
    activeKey,
    onSelect: handleSelect,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`tabs ${className}`}>
        <ul role="tablist" className="tabs-nav">
          {React.Children.map(children, renderTabNav)}
        </ul>
        <div className="tabs-content">
          {React.Children.map(children, child =>
            renderTabContent(child, activeKey)
          )}
        </div>
      </div>
    </TabsContext.Provider>
  );
}
