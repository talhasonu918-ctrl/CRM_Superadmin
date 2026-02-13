import React from 'react';
import Select, { components, OptionProps, SingleValueProps, Props as SelectProps } from 'react-select';
import { getThemeColors } from '../theme/colors';

export interface CustomSelectOption {
    value: string | number;
    label: string;
    sublabel?: string; // e.g., phone number or seat count
    image?: string;
    badge?: string | number;
    badgeColor?: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps extends Omit<SelectProps<CustomSelectOption, false>, 'options' | 'onChange' | 'value'> {
    options: CustomSelectOption[];
    value?: any;
    onChange: (value: any) => void;
    isDarkMode?: boolean;
    label?: string;
}

const CustomMenuList = (props: any) => {
    return (
        <components.MenuList {...props} className="custom-scrollbar scrollbar-thin">
            {props.children}
        </components.MenuList>
    );
};

const CustomOption = (props: OptionProps<CustomSelectOption, false>) => {
    const { data, theme: selectTheme, selectProps } = props;
    const isDarkMode = (selectProps as any).isDarkMode;
    const theme = getThemeColors(isDarkMode);

    return (
        <components.Option {...props}>
            <div className="flex items-center gap-3 py-1">
                {data.image ? (
                    <img src={data.image} alt={data.label} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                ) : data.icon ? (
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface border border-border">
                        {data.icon}
                    </div>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                        {data.label.charAt(0)}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-textPrimary">{data.label}</span>
                        {data.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${data.badgeColor || 'bg-surface border border-border text-textSecondary'}`}>
                                {data.badge}
                            </span>
                        )}
                    </div>
                    {data.sublabel && (
                        <div className="text-[10px] text-textSecondary opacity-80">
                            {data.sublabel}
                        </div>
                    )}
                </div>
            </div>
        </components.Option>
    );
};

const CustomSingleValue = (props: SingleValueProps<CustomSelectOption, false>) => {
    const { data, selectProps } = props;
    const isDarkMode = (selectProps as any).isDarkMode;

    return (
        <components.SingleValue {...props}>
            <div className="flex items-center gap-2">
                <span className="text-xs">{data.label}</span>
            </div>
        </components.SingleValue>
    );
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    isDarkMode = false,
    label,
    placeholder = 'Select...',
    ...props
}) => {
    const theme = getThemeColors(isDarkMode);

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: 'var(--color-surface)',
            borderColor: state.isFocused
                ? 'var(--color-primary)'
                : 'var(--color-border)',
            borderRadius: '0.5rem',
            minHeight: '2.5rem',
            fontSize: '0.875rem',
            boxShadow: state.isFocused ? `0 0 0 1px var(--color-primary)` : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: 'var(--color-primary)'
            }
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'var(--color-surface)',
            border: `1px solid var(--color-border)`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            zIndex: 50
        }),
        menuList: (base: any) => ({
            ...base,
            padding: '4px',
            '&::-webkit-scrollbar': {
                width: '6px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                background: 'var(--color-border)',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: 'var(--color-primary)',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: `var(--color-border) transparent`,
        }),
        option: (base: any, state: any) => ({
            ...base,
            fontSize: '0.75rem',
            backgroundColor: state.isSelected
                ? 'var(--color-primary)'
                : state.isFocused
                    ? 'rgba(234, 88, 12, 0.1)'
                    : 'transparent',
            color: state.isSelected
                ? '#ffffff'
                : 'var(--color-text-primary)',
            borderRadius: '0.5rem',
            padding: '8px 12px',
            margin: '2px 0',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: 'var(--color-primary)'
            }
        }),
        singleValue: (base: any) => ({
            ...base,
            fontSize: '0.75rem',
            color: 'var(--color-text-primary)'
        }),
        placeholder: (base: any) => ({
            ...base,
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)'
        }),
        input: (base: any) => ({
            ...base,
            color: 'var(--color-text-primary)'
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: 'var(--color-text-secondary)',
            '&:hover': {
                color: 'var(--color-primary)'
            }
        })
    };

    const selectedOption = options.find(opt => opt.value === (value?.value || value)) || null;

    return (
        <div className="custom-select-container">
            {label && (
                <label className={`block text-xs font-medium mb-1 ${theme.text.secondary}`}>
                    {label}
                </label>
            )}
            <Select
                {...props}
                {...({ isDarkMode } as any)}
                options={options}
                value={selectedOption}
                onChange={(val: CustomSelectOption | null) => onChange(val)}
                placeholder={placeholder}
                styles={customStyles}
                components={{
                    Option: CustomOption,
                    SingleValue: CustomSingleValue,
                    MenuList: CustomMenuList,
                    ...props.components
                }}
            />
        </div>
    );
};
