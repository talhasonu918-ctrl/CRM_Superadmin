import React from 'react';
import { StaffManagementView } from '@/src/app/modules/StaffManagement';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Staff() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <StaffManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}