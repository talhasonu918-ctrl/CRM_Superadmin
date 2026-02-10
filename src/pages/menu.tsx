import React from 'react';
import { MenuModule } from '../app/modules/menu';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Menu() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <MenuModule isDarkMode={isDarkMode} />
    </Layout>
  );
}