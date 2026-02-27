import React from 'react';
import InventoryManagementView  from '../modules/inventory-management';
import { Layout } from '../../components/NavigationLayout';

export default function Inventory() {
  return (
    <Layout>
      <InventoryManagementView isDarkMode={false} />
    </Layout>
  );
}