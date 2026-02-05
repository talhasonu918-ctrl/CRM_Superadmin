import React from 'react';
import { Filter } from 'lucide-react';
import Select from 'react-select';
import { Controller, Control } from 'react-hook-form';
import { getThemeColors } from '../theme/colors';

interface FilterDropdownProps {
  control: Control<any>;
  name: string;
  options: { label: string; value: string }[];
  placeholder: string;
  inputStyle: string;
  isDarkMode?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  control,
  name,
  options,
  placeholder,
  inputStyle,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const primaryColor = isDarkMode ? '#fb923c' : '#f97316';
  const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
  const focusBgColor = isDarkMode ? '#0f172a' : '#fff';
  const borderColor = isDarkMode ? '#334155' : '#f1f5f9';
  const menuBgColor = isDarkMode ? '#1e293b' : '#f8fafc';
  const menuBorderColor = isDarkMode ? '#334155' : '#e2e8f0';
  const optionSelectedBg = isDarkMode ? '#334155' : '#e2e8f0';
  const optionHoverBg = isDarkMode ? '#475569' : '#f1f5f9';
  const textColor = isDarkMode ? '#e2e8f0' : '#222';
  
  return (
    <div className="relative">

      <Controller
        name={name}
        control={control}
        render={({ field }: any) => (
          <div className="relative">
            <Select
              value={options.find((opt: any) => opt.value === field.value) || null}
              onChange={(option: any) => field.onChange(option ? option.value : '')}
              options={options}
              placeholder={placeholder}
              classNamePrefix="custom-select"
              isSearchable={false}
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  minHeight: 48,
                  height: 48,
                  borderRadius: 8,
                  borderColor: state.isFocused ? primaryColor : borderColor,
                  backgroundColor: state.isFocused ? focusBgColor : bgColor,
                  paddingLeft: 36,
                  fontSize: 15,
                  outline: 'none',
                  boxShadow:'none'
                  
                }),
                valueContainer: (base: any) => ({ ...base, padding: '0 8px' }),
                input: (base: any) => ({ ...base, margin: 0, padding: 0 }),
                singleValue: (base: any) => ({ ...base, margin: 0, padding: 0, color: textColor }),
                dropdownIndicator: (base: any) => ({ ...base, padding: 4 }),
                indicatorSeparator: () => ({ display: 'none' }),
                menu: (base: any) => ({ ...base, zIndex: 20, backgroundColor: menuBgColor, borderRadius: 8, border: `1px solid ${menuBorderColor}` }),
                option: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? optionSelectedBg
                    : state.isFocused
                    ? optionHoverBg
                    : menuBgColor,
                  color: textColor,
                  fontWeight: state.isSelected ? 600 : 400,
                  cursor: 'pointer',
                }),
              }}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
            />
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme.text.muted}`}>
              <Filter size={16} />
            </span>
          </div>
        )}
      />
    </div>
  );
};