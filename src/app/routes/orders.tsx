import React from 'react';
import { OrdersView } from '../modules/Orders';
import { Layout } from '../../components/NavigationLayout';

export default function Orders() {
  return (
    <Layout>
      <OrdersView isDarkMode={false} />
    </Layout>
  );
}