import React, { useState, useRef, useEffect } from 'react';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { getThemeColors } from '../theme/colors';

interface Column {
  id: string;
  label: string;
}

interface ColumnToggleProps {
  columns: Column[];
  hiddenColumns: string[];
  onToggleColumn: (columnId: string) => void;
  isDarkMode?: boolean;
  className?: string;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
  columns,
  hiddenColumns,
  onToggleColumn,
  isDarkMode = false,
  className = '',
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

  const isColumnVisible = (columnId: string) => !hiddenColumns.includes(columnId);

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
              {columns.map((column) => (
                <label key={column.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isColumnVisible(column.id)}
                    onChange={() => onToggleColumn(column.id)}
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