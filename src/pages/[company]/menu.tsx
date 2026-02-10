import React from 'react';
import { MenuManagementView } from '@/src/app/modules/MenuManagement';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Menu() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <MenuManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}