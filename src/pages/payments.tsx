import React from 'react';
import { PaymentView } from '@/src/app/modules/Payments';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Payments() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <PaymentView isDarkMode={isDarkMode} />
    </Layout>
  );
}