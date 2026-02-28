import { useAppSelector } from '../redux/store';
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
// import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
// import { ThemeProvider } from '@/src/contexts/ThemeContext';
// import { BrandingProvider, useBranding } from '@/src/contexts/BrandingContext';
// import { CompanyProvider } from '@/src/contexts/CompanyContext';
import { OrderProvider } from '@/src/contexts/OrderContext';
import { NotificationProvider } from '@/src/contexts/NotificationContext';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/globals.css'; // Corrected path to src/styles/globals.css

import { tenantConfig } from '@/src/config/tenant-color';

// Component that handles authentication routing
interface AppContentProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}


import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../redux/store';
import { checkAuth } from '../redux/authSlice';
import { syncBrandingFromStorage, applyBrandColors } from '../redux/brandingSlice';
import { hydrateTheme } from '../redux/themeSlice';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { BrandingProvider } from '@/src/contexts/BrandingContext';

const AppContent: React.FC<AppContentProps> = ({ Component, pageProps }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const config = useAppSelector((state) => state.branding.config);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentRouter = useRouter();
  const dispatch = useAppDispatch();
  const hydrationRef = useRef(false);

  // Initialize auth only ONCE on mount to prevent infinite loading on iOS
  useEffect(() => {
    if (typeof window !== 'undefined' && !hydrationRef.current) {
      hydrationRef.current = true;
      
      // Sequential dispatch to prevent race conditions
      Promise.resolve()
        .then(() => dispatch(checkAuth()))
        .then(() => dispatch(syncBrandingFromStorage()))
        .then(() => dispatch(hydrateTheme()))
        .catch((err) => console.error('Hydration error:', err));
    }
  }, []); // Empty dependency array - runs only ONCE

  // Apply colors when config or dark mode changes
  useEffect(() => {
    if (config?.colors) {
      dispatch(applyBrandColors({ colors: config.colors, isDarkMode }));
    }
  }, [config?.colors, isDarkMode, dispatch]);

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
  // Redirect to dashboard if authenticated and trying to access auth page
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && currentRouter.pathname !== '/auth') {
        if (typeof window !== 'undefined') currentRouter.replace('/auth');
      } else if (isAuthenticated && currentRouter.pathname === '/auth') {
        const lastCompany = typeof window !== 'undefined' ? localStorage.getItem('lastCompany') || tenantConfig.id : tenantConfig.id;
        if (typeof window !== 'undefined') currentRouter.replace(`/${lastCompany}/dashboard`);
      }
    }
  }, [isAuthenticated, loading, currentRouter]);

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
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="format-detection" content="telephone=no" />
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