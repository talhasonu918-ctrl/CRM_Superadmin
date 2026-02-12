"use client";

import React, { useState } from "react";

export interface TabItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string; // Controlled prop
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isDarkMode?: boolean;
  headerRight?: React.ReactNode;
  onTabChange?: (tabId: string) => void;
  fullHeight?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  variant = 'default',
  size = 'md',
  className = '',
  isDarkMode = false,
  headerRight,
  onTabChange,
  fullHeight = false
}) => {
  const [activeTabState, setActiveTabState] = useState(defaultActiveTab || items[0]?.id || '');

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : activeTabState;

  const handleTabChange = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setActiveTabState(tabId);
    }
    onTabChange?.(tabId);
  };

  const getTabStyles = (isActive: boolean) => {
    const baseStyles = "flex items-center gap-2 font-medium transition-all duration-200 relative";

    switch (variant) {
      case 'pills':
        return `${baseStyles} px-4 py-2 rounded-full ${isActive
          ? "bg-primary text-white shadow-md"
          : "text-textSecondary/60 hover:bg-surface/10"
          }`;

      case 'underline':
        return `${baseStyles} px-1 py-2 border-b-2 ${isActive
          ? "border-primary text-primary"
          : "border-transparent text-textSecondary/60 hover:border-border"
          }`;

      default: // 'default'
        return `${baseStyles} px-4 py-2 rounded-lg ${isActive
          ? "bg-primary text-white shadow-md"
          : "text-textSecondary/60 hover:bg-surface/5"
          }`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const activeContent = items.find(item => item.id === activeTab)?.content;

  return (
    <div className={`w-full ${fullHeight ? 'h-full flex flex-col' : ''} ${className}`}>
      {/* Tab List */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${variant === 'underline' ? "border-b border-border" : ""} ${variant === 'pills' ? "bg-background p-1 rounded-xl" : ""} flex-shrink-0`}>
        <div className="w-full  md:w-auto overflow-auto scrollbar-hidden flex items-center whitespace-nowrap gap-1 overflow-x-auto pb-1 md:pb-0">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`${getTabStyles(isActive)} ${getSizeStyles()} flex-shrink-0`}
              >
                {item.icon && (
                  <span className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}>
                    {item.icon}
                  </span>
                )}
                <span>{item.name}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive
                    ? 'bg-white/20 text-white'
                    : "bg-surface text-textSecondary/60"
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Optional right-side header (notifications, actions) */}
        {headerRight && <div className="self-end md:self-auto flex items-center">{headerRight}</div>}
      </div>

      {/* Tab Content */}
      <div className={`${fullHeight ? 'flex-1 min-h-0' : 'mt-6'}`}>
        {activeContent}
      </div>
    </div>
  );
};

export default Tabs;