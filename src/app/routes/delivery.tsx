import React from 'react';
import { DeliveryView } from '../modules/Delivery';
import { Layout } from '../../components/NavigationLayout';

export default function Delivery() {
  return (
    <Layout>
      <DeliveryView isDarkMode={false} />
    </Layout>
  );
}