import React from 'react';
import { StaffManagementView } from '../modules/StaffManagement';
import { Layout } from '../../components/NavigationLayout';

export default function Staff() {
  return (
    <Layout>
      <StaffManagementView isDarkMode={false} />
    </Layout>
  );
}