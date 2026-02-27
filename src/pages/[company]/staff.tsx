import React from 'react';
import { StaffManagementView } from '@/src/app/modules/StaffManagement';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Staff() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <StaffManagementView isDarkMode={isDarkMode} />
    </Layout>
  );
}