import React from 'react';
import { Layout } from '../../../../components/NavigationLayout';
import { CMSView } from '../../../../app/modules/settings/cms/CMSView';
import { useTheme } from '../../../../contexts/ThemeContext';

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
