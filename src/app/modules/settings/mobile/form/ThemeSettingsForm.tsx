import React from 'react';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { Button } from 'rizzui';
import { getThemeColors } from '../../../../../theme/colors';
import { useBranding } from '../../../../../contexts/BrandingContext';
import { TenantBranding } from '../../../../../theme/types';
import { Image as ImageIcon, Upload, UploadCloud } from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';

interface ThemeSettingsFormProps {
    isDarkMode?: boolean;
    hideSubmitButton?: boolean;
}

export const ThemeSettingsForm: React.FC<ThemeSettingsFormProps> = ({
    isDarkMode = false,
    hideSubmitButton = false,
}) => {
    const theme = getThemeColors(isDarkMode);
    const { config, updateConfig } = useBranding();

    const contextMethods = useFormContext<any>();
    const isContext = !!contextMethods;

    const methods = useForm<any>({
        defaultValues: {
            primary: config.light.primary,
            secondary: config.light.secondary,
            accent: config.light.accent,
            favicon: config.favicon,
            fontFamily: config.fontFamily,
        },
    });

    const { control, handleSubmit, watch } = isContext ? contextMethods : methods;

    const onSubmit = (data: any) => {
        updateConfig({
            light: {
                ...config.light,
                primary: data.primary,
                secondary: data.secondary,
                accent: data.accent,
            },
            favicon: data.favicon,
            fontFamily: data.fontFamily,
            dark: {
                ...config.dark,
                primary: data.primary,
                secondary: data.secondary,
                accent: data.accent,
            }
        });
        toast.success('Theme configuration saved!');
    };

    const inputClass = "w-full h-10 px-3 border rounded-lg focus:outline-none focus:border-orange-500 transition-colors";

    const FormWrapper = isContext ? 'div' : 'form';
    const formProps = isContext
        ? { className: "space-y-6" }
        : { onSubmit: handleSubmit(onSubmit), className: "space-y-6" };

    return (
        // @ts-ignore
        <FormWrapper {...formProps}>
            <div>
                <h3 className={`text-sm sm:text-base font-semibold mb-3 sm:mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
                    Theme Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Primary Color */}
                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                            Primary Color
                        </label>
                        <div className="flex gap-2">
                            <Controller
                                name="primary"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            <input
                                                type="color"
                                                {...field}
                                                className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            {...field}
                                            className={`${inputClass} ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                            Secondary Color
                        </label>
                        <div className="flex gap-2">
                            <Controller
                                name="secondary"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            <input
                                                type="color"
                                                {...field}
                                                className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            {...field}
                                            className={`${inputClass} ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                            Accent Color
                        </label>
                        <div className="flex gap-2">
                            <Controller
                                name="accent"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            <input
                                                type="color"
                                                {...field}
                                                className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            {...field}
                                            className={`${inputClass} ${theme.input.background} ${theme.text.primary} ${theme.border.input}`}
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {/* Font Family */}
                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                            Font Family
                        </label>
                        <Controller
                            name="fontFamily"
                            control={control}
                            render={({ field }) => {
                                const fontOptions = [
                                    // Popular Sans Serif
                                    { value: 'Inter', label: 'Inter (Modern)' },
                                    { value: 'Poppins', label: 'Poppins (Geometric)' },
                                    { value: 'Roboto', label: 'Roboto (System)' },
                                    { value: 'Open Sans', label: 'Open Sans' },
                                    { value: 'Montserrat', label: 'Montserrat (Modern)' },
                                    { value: 'Lato', label: 'Lato' },
                                    { value: 'Raleway', label: 'Raleway' },
                                    { value: 'Nunito', label: 'Nunito (Rounded)' },
                                    { value: 'Quicksand', label: 'Quicksand (Friendly)' },
                                    { value: 'Work Sans', label: 'Work Sans' },
                                    { value: 'Ubuntu', label: 'Ubuntu' },

                                    // Elegant Serif
                                    { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
                                    { value: 'Merriweather', label: 'Merriweather (Classic)' },
                                    { value: 'Lora', label: 'Lora' },
                                    { value: 'Libre Baskerville', label: 'Libre Baskerville' },
                                    { value: 'Source Serif Pro', label: 'Source Serif Pro' },

                                    // Display / Artistic
                                    { value: 'Pacifico', label: 'Pacifico (Script)' },
                                    { value: 'Dancing Script', label: 'Dancing Script' },
                                    { value: 'Orbit', label: 'Orbit (Tech)' },
                                    { value: 'Oranienbaum', label: 'Oranienbaum (Classic)' },
                                    { value: 'Over the Rainbow', label: 'Over the Rainbow' },
                                    { value: 'Lobster', label: 'Lobster' },
                                    { value: 'Abril Fatface', label: 'Abril Fatface' },
                                    { value: 'Bebas Neue', label: 'Bebas Neue' },
                                    { value: 'Cinzel', label: 'Cinzel' },
                                    { value: 'Comfortaa', label: 'Comfortaa' },
                                    { value: 'Great Vibes', label: 'Great Vibes' },
                                    { value: 'Permanent Marker', label: 'Permanent Marker' },
                                    { value: 'Righteous', label: 'Righteous' },
                                    { value: 'Press Start 2P', label: 'Press Start 2P' },
                                    { value: 'Special Elite', label: 'Special Elite' },
                                    { value: 'Unbounded', label: 'Unbounded' },
                                ];

                                const currentValue = fontOptions.find(opt => opt.value === (field.value || config.fontFamily || 'Inter')) || { value: field.value, label: field.value };

                                return (
                                    <div className="font-picker-wrapper">
                                        {/* @ts-ignore */}
                                        <Select
                                            options={fontOptions}
                                            value={currentValue}
                                            onChange={(option: any) => {
                                                const fontName = option?.value;
                                                console.log('%c Staged Font Selection:', 'color: #3b82f6; font-weight: bold;', fontName);

                                                if (fontName) {
                                                    field.onChange(fontName);
                                                    // Removed real-time updateConfig to wait for SAVE button
                                                }
                                            }}
                                            placeholder="Select Font Family"
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    height: '44px',
                                                    borderRadius: '0.5rem',
                                                    border: '1px solid var(--color-border)',
                                                    background: 'var(--color-surface)',
                                                    boxShadow: 'none',
                                                    '&:hover': {
                                                        borderColor: '#f06c22'
                                                    }
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    background: 'var(--color-surface)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: '0.5rem',
                                                    zIndex: 9999
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    background: state.isSelected ? 'rgba(240, 108, 34, 0.15)' : state.isFocused ? 'rgba(240, 108, 34, 0.05)' : 'transparent',
                                                    color: state.isSelected ? '#f06c22' : 'var(--color-text-primary)',
                                                    cursor: 'pointer',
                                                    '&:active': {
                                                        background: 'rgba(240, 108, 34, 0.2)'
                                                    }
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: 'var(--color-text-primary)'
                                                })
                                            }}
                                        />
                                    </div>
                                );
                            }}
                        />
                    </div>

                    {/* Favicon URL & Upload */}
                    <div className="sm:col-span-1">
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                            Favicon
                        </label>
                        <div className="flex items-center gap-3">
                            <div className={`relative w-10 h-10 rounded-lg border ${theme.border.main} overflow-hidden flex items-center justify-center bg-gray-50 shrink-0`}>
                                {watch('favicon') ? (
                                    <img
                                        src={watch('favicon')}
                                        alt="Favicon Preview"
                                        className="w-full h-full object-contain p-1"
                                    />
                                ) : (
                                    <div className="text-gray-400">
                                        {/* @ts-ignore */}
                                        <Image size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex gap-2">
                                <Controller
                                    name="favicon"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            {...field}
                                            placeholder="/favicon.ico or https://..."
                                            className={`${inputClass} ${theme.input.background} ${theme.text.primary} ${theme.border.input} flex-1`}
                                        />
                                    )}
                                />
                                <label className={`flex items-center justify-center w-10 h-10 rounded-lg border ${theme.border.main} ${theme.button.secondary} cursor-pointer hover:bg-gray-100 transition-colors shrink-0`} title="Upload from Gallery">
                                    {/* @ts-ignore */}
                                    <Upload size={18} className={theme.text.primary} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // 100KB limit for localStorage safety
                                                if (file.size > 100 * 1024) {
                                                    toast.error('Favicon must be smaller than 100KB');
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    const base64String = reader.result as string;
                                                    // @ts-ignore
                                                    (isContext ? contextMethods : methods).setValue('favicon', base64String, { shouldDirty: true });
                                                    // Instant update for real-time preview
                                                    updateConfig({ favicon: base64String });
                                                }
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!hideSubmitButton && (
                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        className={`${theme.button.primary} h-10 text-white rounded-lg px-6 sm:px-8 text-sm sm:text-base`}
                    >
                        Apply Theme
                    </Button>
                </div>
            )}
        </FormWrapper>
    );
};
