import React from 'react';
import DispatchView from '@/src/app/modules/dispatch';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Dispatch() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <DispatchView isDarkMode={isDarkMode} />
    </Layout>
  );
}
