import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { PracticeView } from '@/src/app/modules/settings/practice';
import { Layout } from '@/src/components/NavigationLayout';
import { getThemeColors } from '@/src/theme/colors';

export default function PracticeSettings() {
    const router = useRouter();
    const isDarkMode = false;
    const theme = getThemeColors(isDarkMode);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/settings')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme.border.main} ${theme.text.muted} hover:${theme.text.primary} hover:border-orange-400`}
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </button>

                <PracticeView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
