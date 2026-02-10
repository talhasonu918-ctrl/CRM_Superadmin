import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';
import { SettingsView } from '@/src/app/modules/settings/index';

export default function Settings() {
  const { isDarkMode } = useTheme();

  return (
    <Layout>
      <SettingsView isDarkMode={isDarkMode} />
    </Layout>
  );
}