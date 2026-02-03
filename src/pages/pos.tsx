import React from 'react';
import { POSModule } from '../app/modules/pos';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function POS() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <POSModule isDarkMode={isDarkMode} />
    </Layout>
  );
}
