import React from 'react';
import { POSModule } from '@/src/app/modules/pos';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function POS() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <POSModule isDarkMode={isDarkMode} />
    </Layout>
  );
}
