import React from 'react';
import { DashboardView } from '@/src/app/modules/Dashboard';
import { Layout } from '@/src/components/NavigationLayout';

export default function Dashboard() {
  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
}