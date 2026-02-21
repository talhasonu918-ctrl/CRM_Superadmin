import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';
import { AddProductPage } from '@/src/app/modules/product-categories/add-product/AddProductPage';

export default function AddProduct() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <AddProductPage isDarkMode={isDarkMode} />
    </Layout>
  );
}
