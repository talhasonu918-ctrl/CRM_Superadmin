import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { AddProductPage } from '@/src/app/modules/product-categories/add-product/AddProductPage';

export default function AddProduct() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <AddProductPage isDarkMode={isDarkMode} />
    </Layout>
  );
}
