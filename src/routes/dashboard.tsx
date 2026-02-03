import React from 'react';
import { DashboardView } from '../app/modules/Dashboard';
import { Layout } from '../components/NavigationLayout';

export default function Dashboard() {
  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
}