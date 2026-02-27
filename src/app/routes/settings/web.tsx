import React from 'react';
import { Layout } from '../../../components/NavigationLayout';
import { WebSettingsView } from '../../modules/settings/mobile/WebSettingsView';
import { useAppSelector } from '../../../redux/store';

export default function WebSettings() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">
                <WebSettingsView isDarkMode={isDarkMode} />
            </div>
        </Layout>
    );
}
