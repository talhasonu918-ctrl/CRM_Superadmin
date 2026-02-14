import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { BrandingProvider, useBranding } from '@/src/contexts/BrandingContext';
import { CompanyProvider } from '@/src/contexts/CompanyContext';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

import { tenantConfig } from '@/src/config/tenant-color';

// Component that handles authentication routing
interface AppContentProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}

const AppContent: React.FC<AppContentProps> = ({ Component, pageProps }) => {
  const { isAuthenticated, loading } = useAuth();
  const { config } = useBranding();
  const currentRouter = useRouter();

  // Public routes that don't require authentication
  const publicRoutes = ['/auth'];

  // Check if current route requires authentication
  const requiresAuth = !publicRoutes.includes(currentRouter.pathname);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated and trying to access protected route
  if (requiresAuth && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      currentRouter.push('/auth');
    }
    return null;
  }

  // Redirect to dashboard if authenticated and trying to access auth page
  if (currentRouter.pathname === '/auth' && isAuthenticated) {
    if (typeof window !== 'undefined') {
      const lastCompany = localStorage.getItem('lastCompany') || tenantConfig.id;
      currentRouter.push(`/${lastCompany}/dashboard`);
    }
    return null;
  }

  return (
    <>
      <Head>
        <title>{config.name || 'SuperAdmin'}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.tailwind = window.tailwind || {};
            window.tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['var(--font-tenant)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                  },
                  colors: {
                    primary: 'var(--color-primary)',
                    secondary: 'var(--color-secondary)',
                    accent: 'var(--color-accent)',
                    background: 'var(--color-background)',
                    surface: 'var(--color-surface)',
                    textPrimary: 'var(--color-text-primary)',
                    textSecondary: 'var(--color-text-secondary)',
                    border: 'var(--color-border)',
                    success: 'var(--color-success)',
                    warning: 'var(--color-warning)',
                    error: 'var(--color-error)',
                  }
                }
              }
            }
          `
        }} />
      </Head>
      <AuthProvider>
        <ThemeProvider>
          <BrandingProvider>
            <CompanyProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: 'var(--color-primary)',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: 'var(--color-error)',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <AppContent Component={Component} pageProps={pageProps} />
            </CompanyProvider>
          </BrandingProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;