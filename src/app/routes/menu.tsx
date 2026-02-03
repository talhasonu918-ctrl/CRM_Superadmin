import React from 'react';
import { MenuManagementView } from '../modules/MenuManagement';
import { Layout } from '../../components/NavigationLayout';

export default function Menu() {
  return (
    <Layout>
      <MenuManagementView isDarkMode={false} />
    </Layout>
  );
}