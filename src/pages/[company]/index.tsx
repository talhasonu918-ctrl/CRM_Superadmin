import React from 'react';
import { DashboardView } from '@/src/app/modules/Dashboard';
import { Layout } from '@/src/components/NavigationLayout';

export default function Home() {
  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
}