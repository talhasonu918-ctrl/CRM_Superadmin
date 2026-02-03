import React from 'react';
import { PaymentView } from '../modules/Payments';
import { Layout } from '../../components/NavigationLayout';

export default function Payments() {
  return (
    <Layout>
      <PaymentView isDarkMode={false} />
    </Layout>
  );
}