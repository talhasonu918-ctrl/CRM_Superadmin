import React from 'react';
import { Search } from 'lucide-react';
import { Controller, Control } from 'react-hook-form';
import { getThemeColors } from '../theme/colors';

interface SearchInputProps {
  control: Control<any>;
  placeholder?: string;
  inputStyle: string;
  isDarkMode?: boolean;
  
}

export const SearchInput: React.FC<SearchInputProps> = ({
  control,
  placeholder = 'Search...',
  inputStyle,
  isDarkMode = false,
  
}) => {
  const theme = getThemeColors(isDarkMode);
  return (
    <div className="flex-1 relative">
      <Controller
        name="searchTerm"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              type="text"
              placeholder={placeholder}
              className={`${inputStyle} pl-10 w-full ${theme.input.background} border ${theme.border.input} ${theme.input.backgroundFocus} transition-all h-12 min-h-[48px] py-3`}
            />
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme.text.muted}`}>
              <Search size={16} />
            </span>
          </div>
        )}
      />
    </div>
  );
};