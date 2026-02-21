import React from 'react';
import { Layout } from '../../../../components/NavigationLayout';
import { CMSView } from '../../../../app/modules/settings/cms/CMSView';
import { useAppSelector } from '@/src/redux/store';

export default function CMSPage() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <CMSView />
            </div>
        </Layout>
    );
}
