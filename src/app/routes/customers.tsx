import React from 'react';
import { CustomerCRMView } from '../modules/CustomerCRM';
import { Layout } from '../../components/NavigationLayout';

export default function Customers() {
  return (
    <Layout>
      <CustomerCRMView isDarkMode={false} />
    </Layout>
  );
}