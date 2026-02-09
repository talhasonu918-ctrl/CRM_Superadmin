import React from 'react';
import { MobileSettingsForm } from './form/MobileSettingsForm';
import { MobileSettings, defaultMobileSettings } from './types';
import { getThemeColors } from '../../../../theme/colors';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

interface MobileSettingsViewProps {
    isDarkMode?: boolean;
}

export const MobileSettingsView: React.FC<MobileSettingsViewProps> = ({
    isDarkMode = false,
}) => {
    const router = useRouter();
    const theme = getThemeColors(isDarkMode);
    const [settings, setSettings] = React.useState<Partial<MobileSettings>>(defaultMobileSettings);
    const [tenantFont, setTenantFont] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        // Load from localStorage if exists
        const saved = localStorage.getItem('mobile_settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load mobile settings', e);
            }
        }

        // Load global tenant font
        const f = localStorage.getItem('tenantFont');
        if (f) setTenantFont(f);
    }, []);

    const handleSubmit = (data: Partial<MobileSettings>) => {
        setSettings(data);
        localStorage.setItem('mobile_settings', JSON.stringify(data));
        alert('Configuration saved successfully!');
    };

    return (
        <div
            className={`p-4 sm:p-8 rounded-xl border shadow-sm ${theme.neutral.background} ${theme.border.main}`}
            style={{ fontFamily: tenantFont }}
        >
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <button
                    onClick={() => router.push('/settings')}
                    className={`p-2 rounded-lg border ${theme.border.main} ${theme.neutral.backgroundSecondary} ${theme.text.primary} hover:border-orange-500 transition-all`}
                    title="Back to Settings"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h4 className={`text-lg sm:text-xl font-bold tracking-tight ${theme.text.primary}`}>Mobile & Web Settings</h4>
                    <p className={`text-xs sm:text-sm mt-1 ${theme.text.secondary}`}>
                        Configure your application versions and endpoints
                    </p>
                </div>
            </div>

            <MobileSettingsForm
                initialData={settings}
                onSubmit={handleSubmit}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};
