import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { KDSWrapper } from '@/src/app/modules/kitchen-order-display/KDSWrapper';
import { Layout } from '@/src/components/NavigationLayout';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function KitchenDisplay() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [resetCount, setResetCount] = useState(0);

  // Listen for custom reset event (for when user clicks Kitchen Display in sidebar while already on page)
  useEffect(() => {
    const handleReset = () => {
      setResetCount(prev => prev + 1);
    };

    window.addEventListener('resetKitchenDisplay', handleReset);
    
    return () => {
      window.removeEventListener('resetKitchenDisplay', handleReset);
    };
  }, []);

  // Force reset on every route change to this page
  useEffect(() => {
    setResetCount(prev => prev + 1);
  }, [router.asPath]);

  return (
    <Layout>
      <KDSWrapper key={`kds-${resetCount}`} isDarkMode={isDarkMode} />
    </Layout>
  );
}
