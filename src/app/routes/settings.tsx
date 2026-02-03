import React from 'react';
import { SettingsView } from '../modules/settings';
import { Layout } from '../../components/NavigationLayout';

export default function Settings() {
  return (
    <Layout>
      <SettingsView isDarkMode={false} />
    </Layout>
  );
}