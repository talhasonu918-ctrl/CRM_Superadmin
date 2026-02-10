import React from 'react';
import { Layout } from '../../../components/NavigationLayout';
import { WebSettingsView } from '../../modules/settings/mobile/WebSettingsView';

export default function WebSettings() {
    const isDarkMode = false;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <WebSettingsView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
