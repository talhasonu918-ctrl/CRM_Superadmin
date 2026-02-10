import React from 'react';
import { InventoryManagementView } from '@/src/app/modules/InventoryManagement';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Inventory() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <InventoryManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}