import React from 'react';
import { RiderManagementView } from '@/src/app/modules/pos/form/RiderManagementView';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function RiderManagement() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <RiderManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}
