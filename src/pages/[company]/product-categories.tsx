import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';
import { ProductCategoriesView } from '@/src/app/modules/product-categories/index';

export default function ProductCategories() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <ProductCategoriesView isDarkMode={isDarkMode} />
    </Layout>
  );
}
