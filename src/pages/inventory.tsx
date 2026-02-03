import React from 'react';
import { InventoryManagementView } from '../app/modules/InventoryManagement';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Inventory() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <InventoryManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}