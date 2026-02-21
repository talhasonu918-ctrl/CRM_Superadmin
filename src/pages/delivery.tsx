import React from 'react';
import { DeliveryView } from '@/src/app/modules/Delivery';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Delivery() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <DeliveryView isDarkMode={isDarkMode} />
    </Layout>
  );
}