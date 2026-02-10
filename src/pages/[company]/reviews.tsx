import React from 'react';
import { ReviewsView } from '@/src/app/modules/Reviews';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Reviews() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <ReviewsView isDarkMode={isDarkMode} />
    </Layout>
  );
}