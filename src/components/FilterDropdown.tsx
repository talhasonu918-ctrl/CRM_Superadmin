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
      <Filter size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${theme.text.muted}`} />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Select
              value={options.find(opt => opt.value === field.value) || null}
              onChange={option => field.onChange(option ? option.value : '')}
              options={options}
              placeholder={placeholder}
              classNamePrefix="custom-select"
              isSearchable={false}
              styles={{
                control: (base, state) => ({
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
                valueContainer: base => ({ ...base, padding: '0 8px' }),
                input: base => ({ ...base, margin: 0, padding: 0 }),
                singleValue: base => ({ ...base, margin: 0, padding: 0, color: textColor }),
                dropdownIndicator: base => ({ ...base, padding: 4 }),
                indicatorSeparator: () => ({ display: 'none' }),
                menu: base => ({ ...base, zIndex: 20, backgroundColor: menuBgColor, borderRadius: 8, border: `1px solid ${menuBorderColor}` }),
                option: (base, state) => ({
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
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
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