import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import '../../styles/global.css';

// Component that handles authentication routing
interface AppContentProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}

const AppContent: React.FC<AppContentProps> = ({ Component, pageProps }) => {
  const { isAuthenticated, loading } = useAuth();
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
      currentRouter.push('/dashboard');
    }
    return null;
  }

  return <Component {...pageProps} />;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nexus CRM - SuperAdmin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <AuthProvider>
        <ThemeProvider>
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
                  primary: '#f97316',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <AppContent Component={Component} pageProps={pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;