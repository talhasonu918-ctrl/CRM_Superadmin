/**
 * Reusable Dropdown Menu Component
 * 
 * @example Basic Usage
 * ```tsx
 * import { DropdownMenu } from './OrderActionsDropdown';
 * import { Eye, Edit, Trash } from 'lucide-react';
 * 
 * const items = [
 *   { label: 'View', onClick: () => console.log('View'), icon: Eye },
 *   { label: 'Edit', onClick: () => console.log('Edit'), icon: Edit },
 *   { label: 'Delete', onClick: () => console.log('Delete'), icon: Trash, variant: 'danger' },
 * ];
 * 
 * <DropdownMenu items={items} isDarkMode={false} />
 * ```
 * 
 * @example Custom Trigger
 * ```tsx
 * <DropdownMenu 
 *   items={items} 
 *   trigger={<Button>Actions</Button>}
 * />
 * ```
 * 
 * @example Backward Compatible
 * ```tsx
 * <OrderActionsDropdown 
 *   isDarkMode={isDarkMode}
 *   onViewDetails={() => {}}
 *   onMarkAsReady={() => {}}
 *   onPrintReceipt={() => {}}
 *   onCancelOrder={() => {}}
 * />
 * ```
 */

import React from 'react';
import { Dropdown } from 'rizzui';
import { MoreVertical, LucideIcon } from 'lucide-react';
import { getThemeColors } from '../theme/colors';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  isDarkMode?: boolean;
  trigger?: React.ReactNode;
  buttonSize?: number;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isDarkMode = false,
  trigger,
  buttonSize = 18,
}) => {
  const theme = getThemeColors(isDarkMode);
  
  return (
    <Dropdown>
      <Dropdown.Trigger>
        {trigger || (
          <button className={`p-1 rounded-full ${theme.neutral.hover} transition-colors`}>
            <MoreVertical size={buttonSize} className={theme.text.tertiary} />
          </button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu className={`w-48 ${theme.dropdown.bg} ${theme.dropdown.border}`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Dropdown.Item
              key={index}
              onClick={item.onClick}
              disabled={item.disabled}
              className={`${
                item.variant === 'danger'
                  ? theme.dropdown.danger
                  : theme.dropdown.item
              } ${
                theme.dropdown.itemHover
              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon size={16} />}
                <span>{item.label}</span>
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

// Backward compatibility - keep OrderActionsDropdown for existing imports
interface OrderActionsDropdownProps {
  isDarkMode?: boolean;
  onViewDetails?: () => void;
  onMarkAsReady?: () => void;
  onPrintReceipt?: () => void;
  onCancelOrder?: () => void;
}

export const OrderActionsDropdown: React.FC<OrderActionsDropdownProps> = ({
  isDarkMode = false,
  onViewDetails,
  onMarkAsReady,
  onPrintReceipt,
  onCancelOrder,
}) => {
  const items: DropdownMenuItem[] = [
    ...(onViewDetails ? [{ label: 'View Details', onClick: onViewDetails }] : []),
    ...(onMarkAsReady ? [{ label: 'Mark as Ready', onClick: onMarkAsReady }] : []),
    ...(onPrintReceipt ? [{ label: 'Print Receipt', onClick: onPrintReceipt }] : []),
    ...(onCancelOrder ? [{ label: 'Cancel Order', onClick: onCancelOrder, variant: 'danger' as const }] : []),
  ];

  return <DropdownMenu items={items} isDarkMode={isDarkMode} />;
};

export default DropdownMenu;