import React from 'react';
import { ReportsView } from '@/src/app/modules/Reports';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Reports() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <ReportsView isDarkMode={isDarkMode} />
    </Layout>
  );
}