import { useAppSelector } from '../redux/store';
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

import { tenantConfig } from '@/src/config/tenant-color';

// Component that handles authentication routing
interface AppContentProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}


import { useEffect } from 'react';
import { useAppDispatch } from '../redux/store';
import { checkAuth } from '../redux/authSlice';
import { syncBrandingFromStorage, applyBrandColors } from '../redux/brandingSlice';
import { syncThemeFromStorage } from '../redux/themeSlice';

const AppContent: React.FC<AppContentProps> = ({ Component, pageProps }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const config = useAppSelector((state) => state.branding.config);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentRouter = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(syncBrandingFromStorage());
    dispatch(syncThemeFromStorage());
  }, [dispatch]);

  // Apply colors when config or dark mode changes
  useEffect(() => {
    dispatch(applyBrandColors({ colors: config.colors, isDarkMode }));
  }, [config.colors, isDarkMode, dispatch]);

  // Apply fonts
  useEffect(() => {
    if (typeof document !== 'undefined' && config.fonts?.primary) {
      document.documentElement.style.setProperty('--font-tenant', config.fonts.primary);

      // Basic dynamic font loading (Google Fonts)
      const fontId = 'tenant-font-link';
      let link = document.getElementById(fontId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      const fontName = config.fonts.primary.split(',')[0].replace(/['"]/g, '').replace(/ /g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
    }
  }, [config.fonts]);

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
    <Provider store={store}>
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
      </>
    </Provider>
  );
}

export default MyApp;