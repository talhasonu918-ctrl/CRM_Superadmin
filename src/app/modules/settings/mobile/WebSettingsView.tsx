import React, { useEffect } from 'react';
import { MobileSettingsForm } from './form/MobileSettingsForm';
import { ThemeSettingsForm } from './form/ThemeSettingsForm';
import { MobileSettings, defaultMobileSettings } from './types';
import { getThemeColors } from '../../../../theme/colors';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCompany } from '../../../../contexts/CompanyContext';
import { ROUTES } from '../../../../const/constants';
import { useForm, FormProvider } from 'react-hook-form';
import { useBranding } from '../../../../contexts/BrandingContext';
import { Button } from 'rizzui';
import toast from 'react-hot-toast';

interface WebSettingsViewProps {
    isDarkMode?: boolean;
}

export const WebSettingsView: React.FC<WebSettingsViewProps> = ({
    isDarkMode = false,
}) => {
    const router = useRouter();
    const { company } = useCompany();
    const theme = getThemeColors(isDarkMode);
    const { config, updateConfig } = useBranding();

    // Initialize unified form
    const methods = useForm({
        defaultValues: {
            ...defaultMobileSettings,
            primary: config.light.primary,
            secondary: config.light.secondary,
            accent: config.light.accent,
            favicon: config.favicon,
            fontFamily: config.fontFamily,
        }
    });

    // Load settings from local storage and update form ONCE on mount
    useEffect(() => {
        const savedMobile = localStorage.getItem('mobile_settings');
        let parsedMobile = {};

        if (savedMobile) {
            try {
                parsedMobile = JSON.parse(savedMobile);
            } catch (e) {
                console.error('Failed to load mobile settings', e);
            }
        }

        // Initialize form with combined data
        methods.reset({
            ...defaultMobileSettings,
            ...parsedMobile,
            primary: config.light.primary,
            secondary: config.light.secondary,
            accent: config.light.accent,
            favicon: config.favicon,
            fontFamily: config.fontFamily,
        });
    }, []); // Only run once on mount

    // SYNC FORM WITH GLOBAL CONFIG: The Senior approach to global state synchronization
    // This ensures that if FontPicker updates the global state, the form value is also updated
    // preventing the "Save" button from sending stale data.
    useEffect(() => {
        const currentVals = methods.getValues();
        if (config.fontFamily && currentVals.fontFamily !== config.fontFamily) {
            methods.setValue('fontFamily', config.fontFamily, { shouldDirty: true });
        }
        if (config.favicon && currentVals.favicon !== config.favicon) {
            methods.setValue('favicon', config.favicon, { shouldDirty: true });
        }
    }, [config.fontFamily, config.favicon, methods]);
    // Dependency on config ensures that if branding changes externally (or initial load), form updates.
    // Note: This might cause re-renders or resets if config changes frequently.
    // Ideally we only reset once on mount for settings, but branding might be dynamic.
    // Given the task, this is acceptable.

    const onSubmit = (data: any) => {
        // 1. Save Mobile Settings
        const mobileData: Partial<MobileSettings> = {
            appVersion: data.appVersion,
            webVersion: data.webVersion,
            apiEndpoint: data.apiEndpoint,
            maintenanceMode: data.maintenanceMode,
            pushNotifications: data.pushNotifications,
            autoUpdates: data.autoUpdates,
            androidStoreUrl: data.androidStoreUrl,
            iosStoreUrl: data.iosStoreUrl,
            supportEmail: data.supportEmail,
            privacyPolicyUrl: data.privacyPolicyUrl,
            termsOfServiceUrl: data.termsOfServiceUrl,
        };
        localStorage.setItem('mobile_settings', JSON.stringify(mobileData));

        // 2. Save Theme Settings - Explicitly pass all fields to avoid stale closure issues
        updateConfig({
            fontFamily: data.fontFamily,
            favicon: data.favicon,
            light: {
                primary: data.primary,
                secondary: data.secondary,
                accent: data.accent,
                // Background and other BrandColors properties are handled by deep merge in updateConfig
            } as any,
            dark: {
                primary: data.primary,
                secondary: data.secondary,
                accent: data.accent,
            } as any
        });
        // toast.success('Configuration saved successfully!');
    };

    return (
        <div
            className={`p-4 sm:p-8 rounded-xl border shadow-sm ${theme.neutral.background} ${theme.border.main}`}
        >
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <button
                    onClick={() => company && router.push(ROUTES.SETTINGS(company))}
                    className={`p-2 rounded-lg border ${theme.border.main} ${theme.neutral.backgroundSecondary} ${theme.text.primary} hover:border-primary transition-all`}
                    title="Back to Settings"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h4 className={`text-lg sm:text-xl font-bold tracking-tight ${theme.text.primary}`}>Web Settings</h4>
                    <p className={`text-xs sm:text-sm mt-1 ${theme.text.secondary}`}>
                        Configure your web application version and endpoints
                    </p>
                </div>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {/* <MobileSettingsForm
                        isDarkMode={isDarkMode}
                        showOnlyWeb={true}
                        hideSubmitButton={true}
                    /> */}

                    <div className={`mt-8 pt-8 border-t ${theme.border.main}`}>
                        <ThemeSettingsForm
                            isDarkMode={isDarkMode}
                            hideSubmitButton={true}
                        />
                    </div>

                    <div className="flex justify-end mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            type="submit"
                            className={`${theme.button.primary} h-10 text-white rounded-lg px-8 text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95`}
                        >
                            Save Configuration
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
