import React, { useState, useRef, useEffect } from 'react';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { getThemeColors } from '../theme/colors';

interface ColumnToggleProps {
  columnVisibility?: Record<string, boolean>;
  onToggleColumn: (columnId: string) => void;
  disabledColumns?: string[];
  columnLabels?: Record<string, string>;
  isDarkMode?: boolean;
  className?: string;
  // Legacy props for backward compatibility
  columns?: Array<{ id: string; label: string }>;
  hiddenColumns?: string[];
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
  columnVisibility,
  onToggleColumn,
  disabledColumns = [],
  columnLabels = {},
  isDarkMode = false,
  className = '',
  // Legacy props
  columns,
  hiddenColumns,
}) => {
  const theme = getThemeColors(isDarkMode);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Support both new and legacy prop structures
  const getColumns = () => {
    if (columns) return columns;
    if (columnLabels) {
      return Object.entries(columnLabels).map(([id, label]) => ({ id, label }));
    }
    return [];
  };

  const isColumnVisible = (columnId: string) => {
    if (columnVisibility) {
      return columnVisibility[columnId] !== false;
    }
    if (hiddenColumns) {
      return !hiddenColumns.includes(columnId);
    }
    return true;
  };

  const isColumnDisabled = (columnId: string) => {
    return disabledColumns.includes(columnId);
  };

  const columnsList = getColumns();

  return (
    <div ref={dropdownRef} className={`relative flex-shrink-0 ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`p-2 rounded-lg border transition-all ${theme.button.secondary}`}
        title="Toggle Columns"
      >
        <HiAdjustmentsHorizontal size={20} />
      </button>

      {showDropdown && (
        <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl border z-50 ${theme.dropdown.bg} ${theme.dropdown.border}`}>
          <div className="p-3 max-h-80 overflow-y-auto">
            <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
              Show/Hide Columns
            </h3>
            <div className="space-y-2">
              {columnsList.map((column) => (
                <label key={column.id} className={`flex items-center gap-2 cursor-pointer ${isColumnDisabled(column.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isColumnVisible(column.id)}
                    onChange={() => !isColumnDisabled(column.id) && onToggleColumn(column.id)}
                    disabled={isColumnDisabled(column.id)}
                    className={`rounded ${theme.border.input} ${theme.primary.text} focus:ring-2 ${theme.primary.ring}`}
                  />
                  <span className={`text-sm ${theme.text.secondary}`}>
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};