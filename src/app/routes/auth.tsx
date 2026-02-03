import React from 'react';
import { AuthView } from '../modules/Auth';
import { AuthMode } from '../../lib/types';

export default function Auth() {
  return (
    <AuthView
      mode={AuthMode.LOGIN}
      onSwitchMode={() => {}}
      onSuccess={() => {}}
      isDarkMode={false}
      toggleTheme={() => {}}
    />
  );
}