import React from 'react';
import { OnlineOrdersView } from '@/src/app/modules/pos/form/OnlineOrdersView';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function OnlineOrders() {
    const { isDarkMode } = useTheme();

    return (
        <Layout>
            <OnlineOrdersView isDarkMode={isDarkMode} />
        </Layout>
    );
}
