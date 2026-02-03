import React, { useState } from 'react';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { getThemeColors } from '../theme/colors';


interface ColumnToggleProps {
  columnVisibility: Record<string, boolean>;
  onToggleColumn: (columnId: string) => void;
  columnLabels?: Record<string, string>;
  disabledColumns?: string[];
  className?: string;
  isDarkMode?: boolean;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
  columnVisibility,
  onToggleColumn,
  columnLabels = {},
  disabledColumns = [],
  className = '',
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const [showDropdown, setShowDropdown] = useState(false);

  const getColumnLabel = (columnId: string) => {
    return columnLabels[columnId] || columnId;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`p-2 text-sm border ${theme.border.input} rounded-lg ${theme.neutral.hoverLight}`}
        title="Toggle Columns"
      >
        <HiAdjustmentsHorizontal className={`w-8 h-8 ${theme.text.secondary}`} />
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className={`absolute right-0 top-full z-20 mt-1 w-48 ${theme.neutral.backgroundSecondary} border ${theme.border.main} rounded-md ${theme.shadow.lg}`}>
            <div className="p-2">
              <div className={`text-xs font-medium ${theme.text.tertiary} mb-2`}>Toggle Columns</div>
              {Object.entries(columnVisibility).map(([columnId, isVisible]) => (
                <label
                  key={columnId}
                  className={`flex items-center gap-2 w-full px-2 py-1 text-sm ${theme.text.secondary} ${theme.neutral.hoverLight} rounded cursor-pointer`}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleColumn(columnId)}
                    disabled={disabledColumns.includes(columnId)}
                    className="w-4 h-4 text-orange-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:border-slate-600"
                  />
                  {getColumnLabel(columnId)}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};