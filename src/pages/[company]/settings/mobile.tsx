import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { MobileSettingsView } from '@/src/app/modules/settings/mobile';

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
