import React from 'react';
import { StaffManagementView } from '../app/modules/StaffManagement';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Staff() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <StaffManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}