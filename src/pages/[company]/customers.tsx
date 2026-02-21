import React from 'react';
import { CustomerCRMView } from '@/src/app/modules/CustomerCRM';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Customers() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <CustomerCRMView isDarkMode={isDarkMode} />
    </Layout>
  );
}