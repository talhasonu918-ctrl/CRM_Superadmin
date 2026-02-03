import React from 'react';
import { ReportsView } from '../modules/Reports';
import { Layout } from '../../components/NavigationLayout';

export default function Reports() {
  return (
    <Layout>
      <ReportsView isDarkMode={false} />
    </Layout>
  );
}