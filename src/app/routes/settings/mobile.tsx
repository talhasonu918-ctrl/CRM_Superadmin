import React from 'react';
import { Layout } from '../../../components/NavigationLayout';
import { MobileSettingsView } from '../../modules/settings/mobile';

export default function MobileSettings() {
    // Determine dark mode (this could also come from a context or theme hook)
    const isDarkMode = false;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <MobileSettingsView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
