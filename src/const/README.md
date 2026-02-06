# Routes Configuration

This directory contains all routing-related configuration and utilities for the Invex Food application.

## Structure

```
routes/
├── index.ts          # Main exports
├── constants.ts      # Route path constants
├── navigation.ts     # Navigation menu configuration
├── config.ts         # Route metadata and configuration
└── utils.ts          # Route utility functions and hooks
```

## Files Description

### `constants.ts`
Contains all route path constants used throughout the application.

```typescript
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  // ... etc
} as const;
```

### `navigation.ts`
Defines the navigation menu items with their icons, labels, and descriptions.

```typescript
export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  // ... more items
];
```

### `config.ts`
Contains route configuration with metadata like titles, descriptions, and layout requirements.

```typescript
export const routeConfigs: Record<string, RouteConfig> = {
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard - Invex Food',
    description: 'CRM Dashboard and Analytics',
    requiresAuth: false,
    component: 'Dashboard',
    layout: 'default'
  },
  // ... more configs
};
```

### `utils.ts`
Provides utility functions and hooks for routing operations.

```typescript
export function useAppRouter() {
  // Custom routing hook with navigation helpers
}

export function getRouteTitle(path: string): string {
  // Get SEO-friendly title for route
}
```

## Usage

### Basic Navigation
```typescript
import { useAppRouter } from '../routes';

function MyComponent() {
  const { navigateTo, isActiveRoute } = useAppRouter();

  return (
    <button onClick={() => navigateTo('DASHBOARD')}>
      Go to Dashboard
    </button>
  );
}
```

### Using Route Constants
```typescript
import { ROUTES } from '../routes';

<Link href={ROUTES.ORDERS}>Orders</Link>
```

### Navigation Configuration
```typescript
import { navigationItems } from '../routes';

navigationItems.map(item => (
  <Link key={item.name} href={item.href}>
    <item.icon /> {item.name}
  </Link>
));
```

## Route Types

- `default`: Uses NavigationLayout with sidebar
- `auth`: Authentication pages (login/register)
- `none`: No layout wrapper

## Adding New Routes

1. Add route constant to `constants.ts`
2. Add navigation item to `navigation.ts` (if applicable)
3. Add route config to `config.ts`
4. Create page component in `src/pages/`
5. Import and use the component in the page file

## Benefits

- **Centralized Configuration**: All routes defined in one place
- **Type Safety**: TypeScript support for route keys and values
- **SEO Ready**: Built-in title and description management
- **Maintainable**: Easy to add, remove, or modify routes
- **Reusable**: Navigation components automatically use configuration