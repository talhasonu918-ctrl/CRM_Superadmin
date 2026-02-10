import { useRouter } from 'next/router';
import { ROUTES, RouteKey } from './constants';
import { routeConfigs, getRouteConfig } from './config';

/**
 * Custom hook for route navigation
 */
export function useAppRouter() {
  const router = useRouter();

  const navigateTo = (route: RouteKey | string) => {
    const path = typeof route === 'string' ? route : ROUTES[route];
    router.push(path);
  };

  const replaceTo = (route: RouteKey | string) => {
    const path = typeof route === 'string' ? route : ROUTES[route];
    router.replace(path);
  };

  const goBack = () => {
    router.back();
  };

  const getCurrentRouteConfig = () => {
    return getRouteConfig(router.pathname);
  };

  const isActiveRoute = (route: RouteKey | string) => {
    const path = typeof route === 'string' ? route : ROUTES[route];
    return router.pathname === path;
  };

  return {
    navigateTo,
    replaceTo,
    goBack,
    getCurrentRouteConfig,
    isActiveRoute,
    currentPath: router.pathname,
    query: router.query,
  };
}

/**
 * Get route title for SEO
 */
export function getRouteTitle(path: string): string {
  const config = getRouteConfig(path);
  return config?.title || 'Invex Food - SuperAdmin';
}

/**
 * Get route description for SEO
 */
export function getRouteDescription(path: string): string {
  const config = getRouteConfig(path);
  return config?.description || 'Comprehensive CRM solution for restaurant management';
}

/**
 * Check if route requires authentication
 */
export function requiresAuth(path: string): boolean {
  const config = getRouteConfig(path);
  return config?.requiresAuth || false;
}

/**
 * Get all public routes (don't require auth)
 */
export function getPublicRoutes() {
  return Object.values(routeConfigs).filter(route => !route.requiresAuth);
}

/**
 * Get all protected routes (require auth)
 */
export function getProtectedRoutes() {
  return Object.values(routeConfigs).filter(route => route.requiresAuth);
}

/**
 * Generate breadcrumbs for a route
 */
export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: Array<{ name: string; href: string }> = [
    { name: 'Home', href: ROUTES.HOME }
  ];

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const config = getRouteConfig(currentPath);

    if (config) {
      breadcrumbs.push({
        name: config.component,
        href: currentPath,
      });
    }
  });

  return breadcrumbs;
}