import React from 'react';
import { DashboardView } from '../app/modules/Dashboard';
import { Layout } from '../components/NavigationLayout';

export default function Home() {
  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
}