import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { OrganizationSettingsForm } from './form/OrganizationSettingsForm';
import { PracticeSetting } from './types';
import { getThemeColors } from '../../../../theme/colors';
import { useCompany } from '../../../../contexts/CompanyContext';
import { ROUTES } from '../../../../const/constants';

interface OrganizationSettingsViewProps {
    isDarkMode: boolean;
}

const STORAGE_KEY = 'organization_settings';

export const OrganizationSettingsView: React.FC<OrganizationSettingsViewProps> = ({ isDarkMode }) => {
    const router = useRouter();
    const { company } = useCompany();
    const theme = getThemeColors(isDarkMode);
    const [organizationData, setOrganizationData] = useState<Partial<PracticeSetting> | null>(null);
    const [tenantFont, setTenantFont] = useState<string | undefined>(undefined);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setOrganizationData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading organization settings:', error);
            }
        }

        // Load global tenant font
        const f = localStorage.getItem('tenantFont');
        if (f) setTenantFont(f);
    }, []);

    const handleSubmit = (data: Partial<PracticeSetting>) => {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setOrganizationData(data);
        alert('Organization settings saved successfully!');
    };

    return (
        <div
            className={`p-4 sm:p-8 rounded-xl shadow-sm ${theme.neutral.background}`}
            style={{ fontFamily: tenantFont }}
        >
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <button
                    onClick={() => company && router.push(ROUTES.SETTINGS(company))}
                    className={`p-2 rounded-lg border ${theme.border.main} ${theme.neutral.backgroundSecondary} ${theme.text.primary} hover:border-orange-500 transition-all`}
                    title="Back to Settings"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h4 className={`text-lg sm:text-xl font-bold tracking-tight ${theme.text.primary}`}>Organization Settings</h4>
                    <p className={`text-xs sm:text-sm mt-1 ${theme.text.secondary}`}>
                        Manage your organization configuration and details
                    </p>
                </div>
            </div>

            <OrganizationSettingsForm
                initialData={organizationData || {}}
                onSubmit={handleSubmit}
                isEditMode={!!organizationData}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};
