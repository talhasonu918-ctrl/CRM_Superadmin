// ✅ All imports consolidated at top - fixes iOS Safari module order issue
import React, { useEffect, useRef } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store, useAppSelector, useAppDispatch } from '../redux/store';
import { OrderProvider } from '@/src/contexts/OrderContext';
import { NotificationProvider } from '@/src/contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { tenantConfig } from '@/src/config/tenant-color';
import { checkAuth } from '../redux/authSlice';
import { syncBrandingFromStorage, applyBrandColors } from '../redux/brandingSlice';
import { hydrateTheme } from '../redux/themeSlice';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { BrandingProvider } from '@/src/contexts/BrandingContext';

interface AppContentProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}

const AppContent: React.FC<AppContentProps> = ({ Component, pageProps }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const config = useAppSelector((state) => state.branding.config);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentRouter = useRouter();
  const dispatch = useAppDispatch();
  const hydrationRef = useRef(false);

  // ✅ FIX 1: Initialize auth only ONCE - prevents iOS re-render loop
  useEffect(() => {
    if (!hydrationRef.current) {
      hydrationRef.current = true;
      dispatch(checkAuth());       // Sync read from localStorage
      dispatch(syncBrandingFromStorage());
      dispatch(hydrateTheme());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ REMOVED iOS 3s fallback - no longer needed since loading starts as false

  // Apply colors when config or dark mode changes
  useEffect(() => {
    if (config?.colors) {
      dispatch(applyBrandColors({ colors: config.colors, isDarkMode }));
    }
  }, [config?.colors, isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply fonts
  useEffect(() => {
    if (typeof document !== 'undefined' && config?.fonts?.primary) {
      document.documentElement.style.setProperty('--font-tenant', config.fonts.primary);
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
  }, [config?.fonts]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ FIX 3: Safe router redirect with localStorage try-catch (iOS private mode safe)
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && currentRouter.pathname !== '/auth') {
      currentRouter.replace('/auth');
    } else if (isAuthenticated && currentRouter.pathname === '/auth') {
      let lastCompany = tenantConfig.id;
      try {
        lastCompany = localStorage.getItem('lastCompany') || tenantConfig.id;
      } catch {
        // iOS private browsing - use default tenant
      }
      currentRouter.replace(`/${lastCompany}/dashboard`);
    }
  }, [isAuthenticated, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
      <NotificationProvider>
        <OrderProvider>
          <ThemeProvider> {/* Ensure ThemeProvider wraps the app */}
            <BrandingProvider>
              <>
              <Head>
                {/* Viewport is in _document.tsx - no duplicate needed here */}
                <title>SuperAdmin</title>
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
            </BrandingProvider>
          </ThemeProvider>
        </OrderProvider>
      </NotificationProvider>
    </Provider>
  );
}

export default MyApp;