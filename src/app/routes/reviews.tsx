import React from 'react';
import { ReviewsView } from '../modules/Reviews';
import { Layout } from '../../components/NavigationLayout';

export default function Reviews() {
  return (
    <Layout>
      <ReviewsView isDarkMode={false} />
    </Layout>
  );
}