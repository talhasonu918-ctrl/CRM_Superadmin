import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/src/contexts/AuthContext';
import { tenantConfig } from '@/src/config/tenant-color';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Get last accessed company or use tenant default
        const lastCompany = localStorage.getItem('lastCompany') || tenantConfig.id;
        router.push(`/${lastCompany}/dashboard`);
      } else {
        router.push('/auth');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}