import React from 'react';
import { Layout } from '../../components/NavigationLayout';
import { MobileSettingsView } from '../../app/modules/settings/mobile';

export default function MobileSettings() {
    const isDarkMode = false;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <MobileSettingsView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
// End of file
