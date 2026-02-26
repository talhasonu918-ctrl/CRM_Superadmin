import React from 'react';
import { useRouter } from 'next/router';
import { POSModule } from '@/src/app/modules/pos';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function POS() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { tab } = router.query;

  return (
    <Layout>
      <POSModule 
        isDarkMode={isDarkMode} 
        initialTab={(tab as string) || 'pos'} 
      />
    </Layout>
  );
}
