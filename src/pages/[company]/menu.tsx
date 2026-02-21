import React from 'react';
import { MenuModule } from '@/src/app/modules/menu';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function Menu() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <MenuModule isDarkMode={isDarkMode} />
    </Layout>
  );
}