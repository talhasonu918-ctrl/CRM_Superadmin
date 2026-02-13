import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { CMSView } from '@/src/app/modules/settings/cms/CMSView';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function CMSPage() {
    const { isDarkMode } = useTheme();

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <CMSView />
            </div>
        </Layout>
    );
}
