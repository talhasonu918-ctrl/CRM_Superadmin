import React from 'react';
import { Layout } from '../../../components/NavigationLayout';
import { OrganizationSettingsView } from '../../modules/settings/practice/OrganizationSettingsView';

export default function OrganizationSettings() {
    // Determine dark mode (this could also come from a context or theme hook)
    const isDarkMode = false;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <OrganizationSettingsView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
