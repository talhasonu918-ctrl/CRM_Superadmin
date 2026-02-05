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
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        {data.icon}
                    </div>
                ) : (
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold uppercase ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                        {data.label.charAt(0)}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium ">{data.label}</span>
                        {data.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${data.badgeColor || (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                                {data.badge}
                            </span>
                        )}
                    </div>
                    {data.sublabel && (
                        <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
            backgroundColor: isDarkMode ? theme.raw.mode.background.card : theme.raw.mode.background.primary,
            borderColor: state.isFocused
                ? theme.raw.primary[500]
                : isDarkMode ? theme.raw.mode.border.secondary : theme.raw.mode.border.primary,
            borderRadius: '0.5rem',
            minHeight: '2.5rem',
            fontSize: '0.875rem',
            boxShadow: state.isFocused ? `0 0 0 1px ${theme.raw.primary[500]}` : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: theme.raw.primary[500]
            }
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: isDarkMode ? theme.raw.mode.background.card : theme.raw.mode.background.primary,
            border: `1px solid ${isDarkMode ? theme.raw.mode.border.secondary : theme.raw.mode.border.primary}`,
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
                background: isDarkMode ? '#475569' : '#cbd5e1',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: theme.raw.primary[500],
            },
            scrollbarWidth: 'thin',
            scrollbarColor: `${isDarkMode ? '#475569' : '#cbd5e1'} transparent`,
        }),
        option: (base: any, state: any) => ({
            ...base,
            fontSize: '0.75rem',
            backgroundColor: state.isSelected
                ? theme.raw.primary[500]
                : state.isFocused
                    ? (isDarkMode ? `${theme.raw.primary[500]}1a` : `${theme.raw.primary[500]}0d`) // 10% and 5% opacity
                    : 'transparent',
            color: state.isSelected
                ? '#ffffff'
                : isDarkMode ? theme.raw.mode.text.primary : theme.raw.mode.text.primary,
            borderRadius: '0.5rem',
            padding: '8px 12px',
            margin: '2px 0',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: theme.raw.primary[600]
            }
        }),
        singleValue: (base: any) => ({
            ...base,
            fontSize: '0.75rem',
            color: isDarkMode ? theme.raw.mode.text.primary : theme.raw.mode.text.primary
        }),
        placeholder: (base: any) => ({
            ...base,
            fontSize: '0.75rem',
            color: isDarkMode ? theme.raw.mode.text.muted : theme.raw.mode.text.muted
        }),
        input: (base: any) => ({
            ...base,
            color: isDarkMode ? theme.raw.mode.text.primary : theme.raw.mode.text.primary
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: isDarkMode ? theme.raw.mode.text.muted : theme.raw.mode.text.muted,
            '&:hover': {
                color: theme.raw.primary[500]
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
