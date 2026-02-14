'use client';

import React, { useEffect } from 'react';
import { ThemeSettingsForm } from './form/ThemeSettingsForm';
import { useRouter } from 'next/router';
import { useCompany } from '../../../../contexts/CompanyContext';
import { ROUTES } from '../../../../const/constants';
import { useForm, FormProvider } from 'react-hook-form';
import { useBranding } from '../../../../contexts/BrandingContext';
import { Button } from 'rizzui';
import notify from '../../../../utils/toast';
import { TenantBranding } from '../../../../theme/types';

import { ArrowLeft } from 'lucide-react';
import { getThemeColors } from '../../../../theme/colors';
import { DeleteConfirmModal } from '../../../../components/DeleteConfirmModal';
import { useState } from 'react';
import { tenantConfig } from '../../../../config/tenant-color';

export function WebSettingsView({ isDarkMode = false }: { isDarkMode?: boolean }) {
    const theme = getThemeColors(isDarkMode);
    const router = useRouter();
    const { company } = useCompany();
    const { config, updateConfig, saveConfig } = useBranding();

    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const methods = useForm<TenantBranding>({
        defaultValues: config
    });

    useEffect(() => {
        methods.reset(config);
    }, [config, methods]);

    const onSubmit = (data: TenantBranding) => {
        try {
            updateConfig(data);
            // We need to call saveConfig or directly update localStorage
            localStorage.setItem('tenant_branding_v2', JSON.stringify(data));

            // Update lastCompany to prevent redirect loop to old slug
            if (data.slug && data.slug !== 'default') {
                localStorage.setItem('lastCompany', data.slug);
            }

            notify.success('Configuration saved successfully');

            // Check if slug has changed and redirect
            const currentSlug = (router.query.company as string) || window.location.pathname.split('/')[1];

            console.log('DEBUG REDIRECT:', {
                formSlug: data.slug,
                currentSlug,
                shouldRedirect: data.slug && data.slug !== currentSlug,
                savedLastCompany: localStorage.getItem('lastCompany')
            });

            if (data.slug && data.slug !== currentSlug) {
                // Redirect to the new slug URL
                setTimeout(() => {
                    console.log('Redirecting to:', `/${data.slug}/settings/web`);
                    window.location.href = `/${data.slug}/settings/web`;
                }, 500);
            }

        } catch (error) {
            notify.error('Failed to save configuration');
        }
    };

    const handleReset = () => {
        setIsResetModalOpen(true);
    };

    const confirmReset = () => {
        localStorage.removeItem('tenant_branding_v2');
        localStorage.removeItem('lastCompany');

        // Force redirect to default URL
        const defaultUrl = `/${tenantConfig.id}/settings/web`;
        window.location.href = defaultUrl;
    };

    return (
        <div className={`min-h-screen ${theme.neutral.backgroundSecondary} pb-20 transition-colors duration-300`}>
            {/* Top Navigation Bar (Admin Branding Settings) */}
            <div className={`${isDarkMode ? theme.neutral.card : 'bg-primary'} flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-0 md:h-14 sticky top-0 z-50 shadow-md gap-3 md:gap-0 transition-colors`}>
                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-start">
                    <button
                        onClick={() => company ? router.push(ROUTES.SETTINGS(company)) : router.back()}
                        className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors text-white flex items-center justify-center"
                        title="Back"
                    >
                        <ArrowLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <h1 className="text-white text-base md:text-lg font-bold truncate">Branding Settings</h1>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={handleReset}
                        className="bg-white text-primary hover:bg-gray-100 px-3 md:px-4 py-1.5 rounded text-[10px] md:text-sm font-bold border border-white transition-all flex-1 md:flex-none whitespace-nowrap"
                    >
                        Reset
                    </button>
                    <button
                        onClick={methods.handleSubmit(onSubmit)}
                        className="bg-secondary text-white px-4 md:px-6 py-1.5 rounded text-[10px] md:text-sm font-bold hover:opacity-90 transition-all shadow-lg flex-1 md:flex-none whitespace-nowrap"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto p-4 md:p-8">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <ThemeSettingsForm isDarkMode={isDarkMode} />
                    </form>
                </FormProvider>
            </div>

            <DeleteConfirmModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={confirmReset}
                onCancel={() => setIsResetModalOpen(false)}
                title="Reset Branding?"
                message="Are you sure you want to reset all branding settings to their defaults? This action cannot be undone."
                confirmButtonText="Yes, Reset"
                isDarkMode={isDarkMode}
            />
        </div>
    );
}
