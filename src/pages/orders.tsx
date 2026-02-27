import React from 'react';
import { OrdersView } from '@/src/app/modules/Orders';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Orders() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <OrdersView isDarkMode={isDarkMode} />
    </Layout>
  );
}