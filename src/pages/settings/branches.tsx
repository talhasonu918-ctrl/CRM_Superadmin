import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { BranchesView } from '@/src/app/modules/settings/branches';
import { Layout } from '@/src/components/NavigationLayout';
import { getThemeColors } from '@/src/theme/colors';

export default function BranchesSettings() {
    const router = useRouter();
    const isDarkMode = false;
    const theme = getThemeColors(isDarkMode);

    return (
        <Layout>
            <div className="">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/settings')}
                    className={`flex items-center mt-2 gap-2 mb-2 px-4 py-2 rounded-lg border transition-colors  ${theme.border.main} ${theme.text.muted} hover:${theme.text.primary} hover:border-orange-400`}
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </button>

                <BranchesView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
