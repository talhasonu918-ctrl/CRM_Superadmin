import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { OrganizationSettingsView } from '@/src/app/modules/settings/practice/OrganizationSettingsView';

export default function OrganizationSettings() {
    const isDarkMode = false;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <OrganizationSettingsView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
