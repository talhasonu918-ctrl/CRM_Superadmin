import React from 'react';
import { InventoryManagementView } from '../modules/InventoryManagement';
import { Layout } from '../../components/NavigationLayout';

export default function Inventory() {
  return (
    <Layout>
      <InventoryManagementView isDarkMode={false} />
    </Layout>
  );
}