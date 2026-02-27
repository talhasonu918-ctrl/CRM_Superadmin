import React from 'react';
import { ReviewsView } from '@/src/app/modules/Reviews';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Reviews() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <ReviewsView isDarkMode={isDarkMode} />
    </Layout>
  );
}