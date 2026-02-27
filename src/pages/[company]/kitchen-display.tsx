import React from 'react';
import KitchenDisplayView from '@/src/app/modules/kitchen-order-display/KDSWrapper';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function KitchenDisplay() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <KitchenDisplayView isDarkMode={isDarkMode} />
    </Layout>
  );
}
