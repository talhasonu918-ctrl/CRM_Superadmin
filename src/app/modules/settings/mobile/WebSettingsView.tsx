import React from 'react';
import { MobileSettingsForm } from './form/MobileSettingsForm'; // We'll refactor this to be generic or create WebSettingsForm
import { MobileSettings, defaultMobileSettings } from './types';
import { getThemeColors } from '../../../../theme/colors';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCompany } from '../../../../contexts/CompanyContext';
import { ROUTES } from '../../../../const/constants';

interface WebSettingsViewProps {
    isDarkMode?: boolean;
}

export const WebSettingsView: React.FC<WebSettingsViewProps> = ({
    isDarkMode = false,
}) => {
    const router = useRouter();
    const { company } = useCompany();
    const theme = getThemeColors(isDarkMode);
    const [settings, setSettings] = React.useState<Partial<MobileSettings>>(defaultMobileSettings);
    const [tenantFont, setTenantFont] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const saved = localStorage.getItem('mobile_settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load mobile settings', e);
            }
        }
        const f = localStorage.getItem('tenantFont');
        if (f) setTenantFont(f);
    }, []);

    const handleSubmit = (data: Partial<MobileSettings>) => {
        setSettings(data);
        localStorage.setItem('mobile_settings', JSON.stringify(data));
        alert('Web configuration saved successfully!');
    };

    return (
        <div
            className={`p-4 sm:p-8 rounded-xl border shadow-sm ${theme.neutral.background} ${theme.border.main}`}
            style={{ fontFamily: tenantFont }}
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

            <MobileSettingsForm
                initialData={settings}
                onSubmit={handleSubmit}
                isDarkMode={isDarkMode}
                showOnlyWeb={true}
            />
        </div>
    );
};
