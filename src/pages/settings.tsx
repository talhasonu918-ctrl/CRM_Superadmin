import React from 'react';
import { Layout } from '../components/NavigationLayout';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsView } from '@/src/app/modules/settings/index';

export default function Settings() {
  const { isDarkMode } = useTheme();
  
  return (
    <Layout>
      <SettingsView isDarkMode={isDarkMode} />
    </Layout>
  );
}