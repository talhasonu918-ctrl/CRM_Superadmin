import React from 'react';
import { OnlineOrdersView } from '@/src/app/modules/pos/form/OnlineOrdersView';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function OnlineOrders() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
        <Layout>
            <OnlineOrdersView isDarkMode={isDarkMode} />
        </Layout>
    );
}
