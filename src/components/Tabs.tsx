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
  onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  variant = 'default',
  size = 'md',
  className = '',
  isDarkMode = false,
  onTabChange
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
        return `${baseStyles} px-4 py-2 rounded-full ${
          isActive
            ? `${theme.primary.main} text-white ${theme.shadow.md}`
            : `${theme.text.tertiary} ${theme.neutral.hover}`
        }`;

      case 'underline':
        return `${baseStyles} px-1 py-2 border-b-2 ${
          isActive
            ? `${theme.primary.border} ${theme.primary.darkText}`
            : `border-transparent ${theme.text.tertiary} ${theme.border.inputFocus.replace('focus:', 'hover:')}`
        }`;

      default: // 'default'
        return `${baseStyles} px-4 py-2 rounded-lg ${
          isActive
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
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div className={`flex ${variant === 'underline' ? `border-b ${theme.border.secondary}` : ''} ${variant === 'pills' ? `${theme.neutral.backgroundSecondary} p-1 rounded-xl` : 'space-x-1'}`}>
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`${getTabStyles(isActive)} ${getSizeStyles()}`}
            >
              {item.icon && (
                <span className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}>
                  {item.icon}
                </span>
              )}
              <span>{item.name}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeContent}
      </div>
    </div>
  );
};

export default Tabs;