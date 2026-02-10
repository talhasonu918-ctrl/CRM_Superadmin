import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Select } from 'rizzui';
import { MobileSettings, defaultMobileSettings } from '../types';
import { getThemeColors } from '../../../../../theme/colors';
import { ChevronDown, X } from 'lucide-react';

interface MobileSettingsFormProps {
    initialData?: Partial<MobileSettings>;
    onSubmit: (data: Partial<MobileSettings>) => void;
    isDarkMode?: boolean;
    showOnlyWeb?: boolean;
    showOnlyMobile?: boolean;
}

const maintenanceOptions = [
    { label: 'Disabled', value: 'Disabled' },
    { label: 'Enabled', value: 'Enabled' },
    { label: 'Scheduled', value: 'Scheduled' },
];

const booleanOptions = [
    { label: 'Enabled', value: 'Enabled' },
    { label: 'Disabled', value: 'Disabled' },
];

export const MobileSettingsForm: React.FC<MobileSettingsFormProps> = ({
    initialData,
    onSubmit,
    isDarkMode = false,
    showOnlyWeb = false,
    showOnlyMobile = false,
}) => {
    const theme = getThemeColors(isDarkMode);
    const { control, handleSubmit } = useForm<Partial<MobileSettings>>({
        defaultValues: initialData || defaultMobileSettings,
    });

    const inputClass = (hasError?: boolean) => `w-full px-4 py-3 border text-sm rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} placeholder:${theme.text.tertiary} ${hasError ? theme.status.error.border : `${theme.border.input} focus:border-primary`
        }`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Version Control Section */}
            <div>
                <h3 className={`text-sm sm:text-base font-semibold mb-3 sm:mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
                    Version Control & API
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {!showOnlyWeb && (
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                App Version <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="appVersion"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} className={inputClass()} placeholder="e.g. 2.1.4" />
                                )}
                            />
                        </div>
                    )}
                    {!showOnlyMobile && (
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Web Version <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="webVersion"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} className={inputClass()} placeholder="e.g. 3.0.1" />
                                )}
                            />
                        </div>
                    )}
                    <div className="sm:col-span-2">
                        <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                            API Endpoint <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="apiEndpoint"
                            control={control}
                            render={({ field }) => (
                                <input {...field} type="url" className={inputClass()} placeholder="https://api.example.com/v1" />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* App Behavior Section */}
            {!showOnlyWeb && (
                <div>
                    <h3 className={`text-sm sm:text-base font-semibold mb-3 sm:mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
                        App Behavior & Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Maintenance Mode <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="maintenanceMode"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={maintenanceOptions}
                                        placeholder="Select status"
                                        {...field}
                                        inPortal={false}
                                        className="w-full max-w-sm"
                                        selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                                        optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                                        dropdownClassName="!w-full !h-auto !max-h-[260px]"
                                        suffix={
                                            <div className="flex items-center gap-2 pr-1">
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange('');
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                    </button>
                                                )}
                                                <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                                            </div>
                                        }
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Push Notifications <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="pushNotifications"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={booleanOptions}
                                        placeholder="Select option"
                                        {...field}
                                        inPortal={false}
                                        className="w-full max-w-sm"
                                        selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                                        optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                                        dropdownClassName="!w-full !h-auto !max-h-[260px]"
                                        suffix={
                                            <div className="flex items-center gap-2 pr-1">
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange('');
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                    </button>
                                                )}
                                                <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                                            </div>
                                        }
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Auto Updates <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="autoUpdates"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={booleanOptions}
                                        placeholder="Select option"
                                        {...field}
                                        inPortal={false}
                                        className="w-full max-w-sm"
                                        selectClassName={`!h-11 !border ${theme.border.input} rounded-lg focus:!border-orange-500 [&_svg.chevron]:aria-expanded:rotate-180`}
                                        optionClassName={`hover:bg-orange-500/20 transition-colors rounded-lg`}
                                        dropdownClassName="!w-full !h-auto !max-h-[260px]"
                                        suffix={
                                            <div className="flex items-center gap-2 pr-1">
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange('');
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                    </button>
                                                )}
                                                <ChevronDown size={18} className="text-gray-400 transition-transform duration-200 chevron" />
                                            </div>
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* App Store Links Section */}
            {!showOnlyWeb && (
                <div>
                    <h3 className={`text-sm sm:text-base font-semibold mb-3 sm:mb-4 pb-2 border-b ${theme.text.primary} ${theme.border.main}`}>
                        Store Links & Legal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Android Store URL <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="androidStoreUrl"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="url" className={inputClass()} placeholder="Google Play Store Link" />
                                )}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                iOS Store URL <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="iosStoreUrl"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="url" className={inputClass()} placeholder="App Store Link" />
                                )}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Support Email <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="supportEmail"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="email" className={inputClass()} placeholder="support@example.com" />
                                )}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Privacy Policy URL <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="privacyPolicyUrl"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="url" className={inputClass()} placeholder="Privacy Policy Link" />
                                )}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${theme.text.tertiary}`}>
                                Terms of Service URL <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="termsOfServiceUrl"
                                control={control}
                                render={({ field }) => (
                                    <input {...field} type="url" className={inputClass()} placeholder="Terms of Service Link" />
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-2">
                <Button
                    type="submit"
                    className={`${theme.button.primary} h-10 sm:h-10 text-white rounded-lg px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto`}
                >
                    Save Configuration
                </Button>
            </div>
        </form>
    );
};
