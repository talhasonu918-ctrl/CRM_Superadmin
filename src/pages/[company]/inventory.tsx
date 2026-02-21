import React from 'react';
import { InventoryManagementView } from '@/src/app/modules/InventoryManagement';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Inventory() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <InventoryManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}