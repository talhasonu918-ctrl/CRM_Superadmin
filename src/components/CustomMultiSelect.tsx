import React from 'react';
import Select, { components, MultiValueProps, MultiValueRemoveProps, Props as SelectProps, GroupBase } from 'react-select';
import { getThemeColors } from '../theme/colors';
import { X } from 'lucide-react';

export interface CustomSelectOption {
    value: string | number;
    label: string;
}

interface CustomMultiSelectProps extends Omit<SelectProps<CustomSelectOption, true>, 'options' | 'onChange' | 'value'> {
    options: CustomSelectOption[];
    value: string[];
    onChange: (values: string[]) => void;
    isDarkMode?: boolean;
    label?: string;
    placeholder?: string;
}

const CustomMultiValue = (props: MultiValueProps<CustomSelectOption, true, GroupBase<CustomSelectOption>>) => {
    return (
        <components.MultiValue {...props}>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                {props.children}
            </div>
        </components.MultiValue>
    );
};

const CustomMultiValueRemove = (props: MultiValueRemoveProps<CustomSelectOption, true, GroupBase<CustomSelectOption>>) => {
    return (
        <components.MultiValueRemove {...props}>
            <X size={12} className="hover:text-red-500 transition-colors" />
        </components.MultiValueRemove>
    );
};

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
    options,
    value,
    onChange,
    isDarkMode = false,
    label,
    placeholder = 'Select options...',
    ...props
}) => {
    const themeColors = getThemeColors(isDarkMode);

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: isDarkMode ? '#1e1e2d' : '#ffffff',
            borderColor: state.isFocused
                ? 'var(--color-primary)'
                : isDarkMode ? '#323248' : '#e2e8f0',
            borderRadius: '0.5rem',
            padding: '2px',
            fontSize: '0.875rem',
            boxShadow: state.isFocused ? `0 0 0 1px var(--color-primary)` : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: 'var(--color-primary)'
            }
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: isDarkMode ? '#1e1e2d' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#323248' : '#e2e8f0'}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            zIndex: 100
        }),
        option: (base: any, state: any) => ({
            ...base,
            fontSize: '0.875rem',
            backgroundColor: state.isSelected
                ? 'var(--color-primary)'
                : state.isFocused
                    ? isDarkMode ? '#2b2b40' : '#fff7ed'
                    : 'transparent',
            color: state.isSelected
                ? '#ffffff'
                : isDarkMode ? '#ffffff' : '#1e293b',
            padding: '8px 12px',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: 'var(--color-primary)'
            }
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: 'transparent',
            margin: '2px',
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: 'inherit',
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0',
            paddingLeft: '0',
        }),
        multiValueRemove: (base: any) => ({
            ...base,
            color: 'inherit',
            padding: '0',
            paddingLeft: '4px',
            '&:hover': {
                backgroundColor: 'transparent',
                color: '#ef4444',
            },
        }),
        input: (base: any) => ({
            ...base,
            color: isDarkMode ? '#ffffff' : '#1e293b'
        }),
        placeholder: (base: any) => ({
            ...base,
            color: isDarkMode ? '#565674' : '#94a3b8'
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: isDarkMode ? '#565674' : '#94a3b8',
            '&:hover': {
                color: 'var(--color-primary)'
            }
        }),
        clearIndicator: (base: any) => ({
            ...base,
            color: isDarkMode ? '#565674' : '#94a3b8',
            '&:hover': {
                color: '#ef4444'
            }
        })
    };

    const selectedOptions = options.filter(opt => value.includes(opt.value.toString()));

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {label}
                </label>
            )}
            <Select
                {...props}
                isMulti
                options={options}
                value={selectedOptions}
                onChange={(newValue: any) => {
                    onChange(newValue ? newValue.map((v: any) => v.value.toString()) : []);
                }}
                placeholder={placeholder}
                styles={customStyles}
                components={{
                    MultiValue: CustomMultiValue,
                    MultiValueRemove: CustomMultiValueRemove,
                    ...props.components
                }}
                classNamePrefix="custom-select"
            />
        </div>
    );
};
