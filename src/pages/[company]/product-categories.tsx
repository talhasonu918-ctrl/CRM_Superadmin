import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { ProductCategoriesView } from '@/src/app/modules/product-categories/index';

export default function ProductCategories() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <ProductCategoriesView isDarkMode={isDarkMode} />
    </Layout>
  );
}
