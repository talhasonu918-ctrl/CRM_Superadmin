import React from 'react';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';
import { ProductCategoriesView } from '@/src/app/modules/product-categories/index';

export default function ProductCategories() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <ProductCategoriesView isDarkMode={isDarkMode} />
    </Layout>
  );
}
