import React from 'react';
import DispatchView from '@/src/app/modules/dispatch';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Dispatch() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <DispatchView isDarkMode={isDarkMode} />
    </Layout>
  );
}
