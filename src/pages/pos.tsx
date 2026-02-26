import React from 'react';
import { useRouter } from 'next/router';
import { POSModule } from '@/src/app/modules/pos';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector } from '@/src/redux/store';

export default function POS() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  // const { isDarkMode } = useTheme();
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
