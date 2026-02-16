'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Button } from 'rizzui';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { TenantBranding } from '../../../../../theme/types';
import Select from 'react-select';
import notify from '../../../../../utils/toast';
import { getThemeColors } from '../../../../../theme/colors';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface ThemeSettingsFormProps {
    isDarkMode?: boolean;
}

const SectionBox = ({ title, children, className = "" }: any) => {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);
    return (
        <div className={`${theme.neutral.card} border ${theme.border.main} rounded-lg shadow-sm mb-4 md:mb-6 ${className} transition-colors duration-300`}>
            <div className={`px-3 md:px-4 py-2.5 md:py-3 ${isDarkMode ? theme.neutral.backgroundSecondary : 'bg-primary'} border-b ${theme.border.main}`}>
                <h3 className={`${isDarkMode ? theme.text.primary : 'text-white'} font-bold text-xs md:text-sm uppercase tracking-wide`}>{title}</h3>
            </div>
            <div className="p-3 md:p-4 lg:p-6">
                {children}
            </div>
        </div>
    );
};

const InputField = ({ label, name, placeholder, disabled = false, type = "text", className = "" }: any) => {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);
    return (
        <div className={`mb-3 md:mb-4 ${className}`}>
            <label className={`block ${theme.text.secondary} text-xs md:text-sm font-semibold mb-1.5 md:mb-2`}>{label}</label>
            <Controller
                name={name}
                render={({ field }) => (
                    <input
                        {...field}
                        type={type}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`w-full h-9 md:h-10 px-2 md:px-3 border ${theme.border.main} rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${disabled ? `${theme.neutral.backgroundSecondary} ${theme.text.muted} cursor-not-allowed` : `${theme.neutral.card} ${theme.text.primary}`}`}
                    />
                )}
            />
        </div>
    );
};

const ColorBox = ({ label, name }: any) => {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);
    return (
        <div className="mb-4">
            <label className={`block ${theme.text.secondary} text-sm font-semibold mb-2`}>{label}</label>
            <Controller
                name={name}
                render={({ field }) => (
                    <div className={`flex items-center w-full border ${theme.border.main} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-sm ${theme.neutral.card}`}>
                        <div className={`relative w-12 h-11 border-r ${theme.border.main} flex-shrink-0`}>
                            <div
                                className="absolute inset-0 w-full h-full"
                                style={{ backgroundColor: field.value }}
                            />
                            <input
                                type="color"
                                {...field}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ padding: 0, margin: 0 }}
                            />
                        </div>
                        <input
                            type="text"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={`flex-1 h-11 px-3 border-none focus:ring-0 text-sm font-mono uppercase ${theme.text.primary} bg-transparent placeholder-gray-400`}
                            placeholder="#000000"
                        />
                    </div>
                )}
            />
        </div>
    );
};

const ImageUploadField = ({ label, name, previewSize = "medium" }: any) => {
    const { watch, setValue } = useFormContext();
    const [isUploading, setIsUploading] = useState(false);
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);
    const url = watch(name);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                notify.error('Image must be smaller than 2MB');
                return;
            }
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue(name, reader.result as string);
                setIsUploading(false);
                notify.success('Image uploaded successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const sizeClasses = {
        small: 'h-12 md:h-16',
        medium: 'h-24 md:h-32',
        large: 'h-32 md:h-48'
    };

    return (
        <div className="mb-4 md:mb-6">
            <label className={`block ${theme.text.secondary} text-xs md:text-sm font-semibold mb-2 md:mb-3`}>{label}</label>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                {/* Preview */}
                <label className={`w-full md:w-48 lg:w-64 ${sizeClasses[previewSize as keyof typeof sizeClasses]} border-2 border-dashed ${theme.border.main} rounded-lg flex items-center justify-center ${theme.neutral.backgroundSecondary} overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative`}>
                    {url ? (
                        <img src={url} alt={label} className="max-w-full max-h-full object-contain p-2" />
                    ) : (
                        <div className={`text-center ${theme.text.muted}`}>
                            <Upload className="mx-auto mb-2" size={20} />
                            <span className="text-xs">No image</span>
                        </div>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                </label>

                {/* URL Input & Upload Button */}
                <div className="flex-1 space-y-2 md:space-y-3">
                    <Controller
                        name={name}
                        render={({ field }) => (
                            <input
                                {...field}
                                placeholder="Enter image URL or upload from gallery"
                                className={`w-full h-9 md:h-10 px-2 md:px-3 border ${theme.border.main} rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary ${theme.neutral.card} ${theme.text.primary}`}
                            />
                        )}
                    />
                    <div className="flex gap-2">
                        <label className="flex-1 bg-primary hover:opacity-90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded cursor-pointer text-xs md:text-sm font-semibold text-center transition-colors">
                            <Upload className="inline-block mr-1 md:mr-2" size={14} />
                            {isUploading ? 'Uploading...' : 'Upload from Gallery'}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                        </label>
                        {url && (
                            <button
                                type="button"
                                onClick={() => setValue(name, '')}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-error hover:opacity-90 text-white rounded text-xs md:text-sm font-semibold transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToggleRow = ({ label, name }: any) => {
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);
    return (
        <div className={`flex items-center justify-between py-2.5 md:py-3 border-b ${theme.border.main} last:border-0`}>
            <span className={`${theme.text.secondary} text-xs md:text-sm font-medium`}>{label}</span>
            <Controller
                name={name}
                render={({ field }) => (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className={`w-10 h-5 md:w-11 md:h-6 ${isDarkMode ? 'bg-surface' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-transparent after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-primary`}></div>
                    </label>
                )}
            />
        </div>
    );
};

const FontSelector = () => {
    const { control, setValue } = useFormContext();
    const [systemFonts, setSystemFonts] = useState<any[]>([]);
    const { isDarkMode } = useTheme();
    const theme = getThemeColors(isDarkMode);

    useEffect(() => {
        // Fetch system fonts from API
        const fetchFonts = async () => {
            try {
                const response = await fetch('/api/fonts');
                if (response.ok) {
                    const fonts: string[] = await response.json();
                    const options = fonts.map(f => ({ value: f, label: f }));
                    setSystemFonts(options);
                }
            } catch (error) {
                console.error('Failed to fetch fonts:', error);
            }
        };
        fetchFonts();
    }, []);

    const googleFonts = [
        { value: 'Inter', label: 'Inter (Modern Sans)' },
        { value: 'Poppins', label: 'Poppins (Geometric)' },
        { value: 'Roboto', label: 'Roboto (Material)' },
        { value: 'Open Sans', label: 'Open Sans (Humanist)' },
        { value: 'Montserrat', label: 'Montserrat (Urban)' },
        { value: 'Lato', label: 'Lato (Classic)' },
        { value: 'Raleway', label: 'Raleway (Elegant)' },
        { value: 'Nunito', label: 'Nunito (Rounded)' },
        { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
        { value: 'Merriweather', label: 'Merriweather (Serif)' },
    ];

    const allFonts = [...googleFonts, ...systemFonts];

    return (
        <div className="mb-3 md:mb-4">
            <label className={`block ${theme.text.secondary} text-xs md:text-sm font-semibold mb-1.5 md:mb-2`}>
                Font Family
            </label>
            <Controller
                name="fonts.primary"
                control={control}
                render={({ field }) => (
                    <Select
                        options={allFonts}
                        value={allFonts.find(f => field.value?.includes(f.value))}
                        onChange={(option: any) => {
                            const fontValue = `${option.value}, system-ui, -apple-system, sans-serif`;
                            field.onChange(fontValue);
                            setValue('fonts.heading', fontValue);
                        }}
                        placeholder="Select Font Family"
                        className="text-xs md:text-sm"
                        styles={{
                            control: (base) => ({
                                ...base,
                                minHeight: '36px',
                                height: '36px',
                                background: 'var(--color-surface)',
                                '@media (min-width: 768px)': {
                                    minHeight: '40px',
                                    height: '40px',
                                },
                                borderColor: 'var(--color-border)',
                                '&:hover': {
                                    borderColor: 'var(--color-primary)'
                                }
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: 'var(--color-text-primary)'
                            }),
                            input: (base) => ({
                                ...base,
                                color: 'var(--color-text-primary)'
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: 'var(--color-text-secondary)'
                            }),
                            menu: (base) => ({
                                ...base,
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                zIndex: 9999
                            }),
                            option: (base, state) => ({
                                ...base,
                                background: state.isFocused
                                    ? 'var(--color-surface)'
                                    : 'var(--color-surface)',
                                color: 'var(--color-text-primary)',
                                '&:active': {
                                    background: 'var(--color-primary)',
                                    color: '#ffffff'
                                }
                            })
                        }}
                    />
                )}
            />
        </div>
    );
};

export const ThemeSettingsForm: React.FC<ThemeSettingsFormProps> = ({ isDarkMode }) => {
    // Use the passed prop if provided, otherwise fallback to context
    const themeContext = useTheme();
    const darkMode = typeof isDarkMode === 'boolean' ? isDarkMode : themeContext.isDarkMode;
    const theme = getThemeColors(darkMode);
    const { control, watch, setValue } = useFormContext<TenantBranding>();
    const bannerFields = useFieldArray({ control, name: "images.banners" });
    const homeFields = useFieldArray({ control, name: "images.homeImages" });

    const tenantName = watch('name');

    // Auto-generate slug from tenant name
    useEffect(() => {
        if (tenantName) {
            const generatedSlug = tenantName
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')     // Remove special characters
                .replace(/[\s_-]+/g, '-')     // Replace spaces and underscores with hyphens
                .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens

            setValue('slug', generatedSlug);
        }
    }, [tenantName, setValue]);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column - Main Content (2/3) */}
                <div className="xl:col-span-2 space-y-4 md:space-y-6">
                    <SectionBox title="General Info">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <InputField label="Tenant Name" name="name" placeholder="Enter Tenant Name" />
                            <InputField label="Slug" name="slug" disabled placeholder="tenant-slug" />
                        </div>
                    </SectionBox>

                    <SectionBox title="Typography">
                        <FontSelector />
                    </SectionBox>

                    <SectionBox title="Colors">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            <ColorBox label="Primary Color" name="colors.primary" />
                            <ColorBox label="Secondary Color" name="colors.secondary" />
                            <ColorBox label="Accent Color" name="colors.accent" />
                            <ColorBox label="Background Color" name="colors.background" />
                            <ColorBox label="Dark Color" name="colors.dark" />
                            <ColorBox label="Text Color" name="colors.text" />
                            <ColorBox label="Text Light" name="colors.textLight" />
                            <ColorBox label="Success Color" name="colors.success" />
                            <ColorBox label="Error Color" name="colors.error" />
                            <ColorBox label="Warning Color" name="colors.warning" />
                        </div>
                    </SectionBox>

                    <SectionBox title="Logo & Images">
                        <ImageUploadField label="Logo" name="images.logo" previewSize="medium" />
                        <ImageUploadField label="Logo (White)" name="images.logoWhite" previewSize="medium" />
                        <ImageUploadField label="Favicon" name="images.favicon" previewSize="medium" />
                        <ImageUploadField label="OG Image (Social Share)" name="images.ogImage" previewSize="medium" />
                        <ImageUploadField label="Order History Image" name="images.orderHistoryImage" previewSize="medium" />
                        <ImageUploadField label="Hero Image" name="images.hero" previewSize="large" />
                        <ImageUploadField label="Login Banner" name="images.loginBanner" previewSize="large" />
                        <ImageUploadField label="App Screen 1" name="images.appScreen1" previewSize="medium" />
                        <ImageUploadField label="App Screen 2" name="images.appScreen2" previewSize="medium" />
                    </SectionBox>

                    <SectionBox title="Banners">
                        <div className="space-y-3 md:space-y-4">
                            {bannerFields.fields.map((field, index) => (
                                <div key={field.id} className={`border ${theme.border.main} rounded-lg p-3 md:p-4 ${theme.neutral.backgroundSecondary}`}>
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <label className={`w-full sm:w-32 h-32 sm:h-20 border-2 ${theme.border.main} rounded ${theme.neutral.card} flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity`}>
                                                {watch(`images.banners.${index}.image`) ? (
                                                    <img
                                                        src={watch(`images.banners.${index}.image`)}
                                                        alt={`Banner ${index + 1}`}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                ) : (
                                                    <span className={`text-[10px] md:text-xs ${theme.text.muted} text-center px-1`}>No image</span>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setValue(`images.banners.${index}.image`, reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <Controller
                                                name={`images.banners.${index}.image`}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        placeholder="Enter banner image URL"
                                                        className={`w-full h-10 px-3 border ${theme.border.main} rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary ${theme.neutral.card} ${theme.text.primary}`}
                                                    />
                                                )}
                                            />
                                            <div className="flex items-stretch gap-2">
                                                <label className="flex-1 h-10 bg-primary hover:opacity-90 text-white px-4 py-2 rounded flex items-center justify-center cursor-pointer text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95">
                                                    <Upload className="mr-2 flex-shrink-0" size={14} />
                                                    <span className="whitespace-nowrap">Upload Image</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setValue(`images.banners.${index}.image`, reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => bannerFields.remove(index)}
                                                    className="px-4 h-10 bg-secondary hover:opacity-90 text-white rounded text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center whitespace-nowrap"
                                                >
                                                    <Trash2 className="mr-1 md:mr-2 flex-shrink-0" size={14} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => bannerFields.append({ id: Date.now(), image: '' })}
                                className={`w-full ${theme.neutral.card} border-2 border-dashed ${theme.border.main} hover:border-primary ${theme.text.primary} hover:bg-primary/5 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group`}
                            >
                                <Plus className="group-hover:scale-110 transition-transform text-primary" size={20} />
                                Add Banner
                            </button>
                        </div>
                    </SectionBox>

                    <SectionBox title="Home Images">
                        <div className="space-y-3 md:space-y-4">
                            {homeFields.fields.map((field, index) => (
                                <div key={field.id} className={`border ${theme.border.main} rounded-lg p-3 md:p-4 ${theme.neutral.backgroundSecondary}`}>
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <label className={`w-full sm:w-32 h-32 border-2 ${theme.border.main} rounded ${theme.neutral.card} flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity`}>
                                                {watch(`images.homeImages.${index}.image`) ? (
                                                    <img
                                                        src={watch(`images.homeImages.${index}.image`)}
                                                        alt={`Home ${index + 1}`}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                ) : (
                                                    <span className={`text-[10px] md:text-xs ${theme.text.muted} text-center px-1`}>No image</span>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setValue(`images.homeImages.${index}.image`, reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <InputField label="Title" name={`images.homeImages.${index}.title`} className="mb-0" />
                                                <InputField label="Category ID" name={`images.homeImages.${index}.categoryId`} className="mb-0" />
                                                <InputField label="Sub Category ID" name={`images.homeImages.${index}.subCategoryId`} className="mb-0" />
                                                <Controller
                                                    name={`images.homeImages.${index}.image`}
                                                    render={({ field }) => (
                                                        <div>
                                                            <label className={`block ${theme.text.secondary} text-xs md:text-sm font-semibold mb-2`}>Image URL</label>
                                                            <input
                                                                {...field}
                                                                placeholder="Enter image URL"
                                                                className={`w-full h-10 px-3 border ${theme.border.main} rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary ${theme.neutral.card} ${theme.text.primary}`}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex items-stretch gap-2">
                                                <label className="flex-1 h-10 bg-primary hover:opacity-90 text-white px-4 py-2 rounded flex items-center justify-center cursor-pointer text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95">
                                                    <Upload className="mr-2 flex-shrink-0" size={14} />
                                                    <span className="whitespace-nowrap">Upload Image</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setValue(`images.homeImages.${index}.image`, reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => homeFields.remove(index)}
                                                    className="px-4 h-10 bg-secondary hover:opacity-90 text-white rounded text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center whitespace-nowrap"
                                                >
                                                    <Trash2 className="mr-1 md:mr-2 flex-shrink-0" size={14} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => homeFields.append({ id: Date.now(), image: '', title: '', categoryId: '', subCategoryId: '' })}
                                className={`w-full ${theme.neutral.card} border-2 border-dashed ${theme.border.main} hover:border-primary ${theme.text.primary} hover:bg-primary/5 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group`}
                            >
                                <Plus className="group-hover:scale-110 transition-transform text-primary" size={20} />
                                Add Home Image
                            </button>
                        </div>
                    </SectionBox>
                </div>

                {/* Right Column - Sidebar (1/3) */}
                <div className="xl:col-span-1 space-y-4 md:space-y-6">
                    <SectionBox title="Social Media Links">
                        <InputField label="Facebook URL" name="socialMedia.facebook" placeholder="https://facebook.com/your-page" />
                        <InputField label="Instagram URL" name="socialMedia.instagram" placeholder="https://instagram.com/your-page" />
                        <InputField label="Twitter URL" name="socialMedia.twitter" placeholder="https://twitter.com/your-page" />
                        <InputField label="YouTube URL" name="socialMedia.youtube" placeholder="https://youtube.com/your-channel" />
                    </SectionBox>

                    <SectionBox title="Contact Info">
                        <InputField label="Phone Number" name="contact.phone" placeholder="+92-300-0000-000" />
                        <InputField label="Email" name="contact.email" placeholder="info@example.com" />
                        <InputField label="Support Email" name="contact.supportEmail" placeholder="support@example.com" />
                        <InputField label="Address" name="contact.address" placeholder="Enter Business Address" />
                    </SectionBox>

                    <SectionBox title="Business Settings">
                        <InputField label="Currency" name="business.currency" placeholder="PKR" />
                        <InputField label="Currency Symbol" name="business.currencySymbol" placeholder="Rs." />
                        <InputField label="Locale" name="business.locale" placeholder="en-PK" />
                        <InputField label="Timezone" name="business.timezone" placeholder="Asia/Karachi" />
                        <InputField label="Tax Rate (%)" name="business.taxRate" type="number" />
                        <InputField label="Delivery Fee" name="business.deliveryFee" type="number" />
                        <InputField label="Min Order Amount" name="business.minOrderAmount" type="number" />
                    </SectionBox>

                    <SectionBox title="SEO Settings (Features)">
                        <ToggleRow label="Delivery" name="features.delivery" />
                        <ToggleRow label="Pickup" name="features.pickup" />
                        <ToggleRow label="Dine-In" name="features.dineIn" />
                        <ToggleRow label="Online Payment" name="features.onlinePayment" />
                        <ToggleRow label="Cash on Delivery" name="features.cashOnDelivery" />
                        <ToggleRow label="Loyalty Program" name="features.loyaltyProgram" />
                        <ToggleRow label="Gift Cards" name="features.giftCards" />
                        <ToggleRow label="Scheduling" name="features.scheduling" />
                        <ToggleRow label="Vouchers" name="features.vouchers" />
                    </SectionBox>
                </div>
            </div>
        </div>
    );
};
