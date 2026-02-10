import React from 'react';
import { MenuModule } from '@/src/app/modules/menu';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Menu() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <MenuModule isDarkMode={isDarkMode} />
    </Layout>
  );
}