import React from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';
import { SettingsView } from '@/src/app/modules/settings/index';

export default function Settings() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <Layout>
      <SettingsView isDarkMode={isDarkMode} />
    </Layout>
  );
}