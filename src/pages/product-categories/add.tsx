import React from 'react';
import { Layout } from '../../components/NavigationLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { AddProductPage } from '../../app/modules/product-categories/add-product/AddProductPage';

export default function AddProduct() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <AddProductPage isDarkMode={isDarkMode} />
    </Layout>
  );
}
