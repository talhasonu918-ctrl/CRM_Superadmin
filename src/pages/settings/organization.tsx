import React from 'react';
import { Layout } from '../../components/NavigationLayout';
import { OrganizationSettingsView } from '../../app/modules/settings/practice/OrganizationSettingsView';

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
