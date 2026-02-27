import React from 'react';
import { OrderHistoryView } from '@/src/app/modules/pos/form/OrderHistoryView';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function OrderHistory() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <OrderHistoryView isDarkMode={isDarkMode} />
    </Layout>
  );
}