"use client";

import React, { useState } from "react";
import { getThemeColors } from '../theme/colors';

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
  variant = 'default',
  size = 'md',
  className = '',
  isDarkMode = false,
  headerRight,
  onTabChange,
  fullHeight = false
}) => {
  const theme = getThemeColors(isDarkMode);
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getTabStyles = (isActive: boolean) => {
    const baseStyles = "flex items-center gap-2 font-medium transition-all duration-200 relative";

    switch (variant) {
      case 'pills':
        return `${baseStyles} px-4 py-2 rounded-full ${isActive
          ? `${theme.primary.main} text-white ${theme.shadow.md}`
          : `${theme.text.tertiary} ${theme.neutral.hover}`
          }`;

      case 'underline':
        return `${baseStyles} px-1 py-2 border-b-2 ${isActive
          ? `${theme.primary.border} ${theme.primary.darkText}`
          : `border-transparent ${theme.text.tertiary} ${theme.border.inputFocus.replace('focus:', 'hover:')}`
          }`;

      default: // 'default'
        return `${baseStyles} px-4 py-2 rounded-lg ${isActive
          ? `${theme.primary.main} text-white ${theme.shadow.md}`
          : `${theme.text.tertiary} ${theme.neutral.hoverLight}`
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
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${variant === 'underline' ? `border-b ${theme.border.secondary}` : ''} ${variant === 'pills' ? `${theme.neutral.backgroundSecondary} p-1 rounded-xl` : ''} flex-shrink-0`}>
        <div className="w-full text-sm md:w-auto flex items-center whitespace-nowrap gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
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
                    : `${theme.neutral.backgroundSecondary} ${theme.text.tertiary}`
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