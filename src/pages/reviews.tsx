import React from 'react';
import { ReviewsView } from '../app/modules/Reviews';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Reviews() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <ReviewsView isDarkMode={isDarkMode} />
    </Layout>
  );
}