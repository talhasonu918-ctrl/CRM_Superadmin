import React from 'react';
import { MenuManagementView } from '../app/modules/MenuManagement';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Menu() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <MenuManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}