import React from 'react';
import DispatchView from '../app/modules/dispatch';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';

export default function Dispatch() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <DispatchView isDarkMode={isDarkMode} />
    </Layout>
  );
}
