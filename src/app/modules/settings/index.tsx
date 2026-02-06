import React from 'react';
import {
  Settings as SettingsIcon, Store, Users, Smartphone
} from 'lucide-react';
import { getThemeColors } from '../../../theme/colors';
import { DashboardCard } from './components/DashboardCard';

// Re-exports for backward compatibility
export { UserTable } from './user/table/table';
export { userColumns } from './user/table/columns';
export type { User } from '../../../hooks/useInfiniteTable';
export { useInfiniteTable, loadMoreUsers, generateMockUsers } from '../../../hooks/useInfiniteTable';

export const SettingsView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const theme = getThemeColors(isDarkMode);

  const dashboardItems = [
    {
      id: 'practice',
      title: 'Organization Settings',
      icon: <SettingsIcon />,
      href: '/settings/practice',
    },
    {
      id: 'branches',
      title: 'Branches',
      icon: <Store />,
      href: '/settings/branches',
    },
    {
      id: 'users',
      title: 'Users',
      icon: <Users />,
      href: '/settings/users',
    },
    {
      id: 'mobile',
      title: 'Mobile & Web',
      icon: <Smartphone />,
      href: '/settings/mobile',
    },
  ];

  return (
    <div className="space-y-8 px-4">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-semibold tracking-tight ${theme.text.primary}`}>Settings</h1>
          <p className={`text-sm mt-2 ${theme.text.muted}`}>Manage your practice settings and configurations</p>
        </div>
      </div> */}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:p-4 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl justify-center items-center">
        {dashboardItems.map((item) => (
          <DashboardCard
            key={item.id}
            id={item.id}
            title={item.title}
            icon={item.icon}
            href={item.href}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};
