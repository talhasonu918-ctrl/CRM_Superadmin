import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Building2, MapPin, Users, Smartphone, FileText, ChevronRight } from 'lucide-react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { getThemeColors } from '../../../theme/colors';
import { GridView } from '../../../components/GridView';
import { ReusableModal } from '../../../components/ReusableModal';
import { OrganizationSettingsForm } from './practice/form/OrganizationSettingsForm';
import { MobileSettingsForm } from './mobile/form/MobileSettingsForm';
import { MobileSettings, defaultMobileSettings } from './mobile/types';
import { PracticeSetting } from './practice/types';
import { useAppSelector } from '../../../redux/store';
import { ROUTES } from '../../../const/constants';

interface SettingsViewProps {
  isDarkMode: boolean;
}

const STORAGE_KEY = 'organization_settings';

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode }) => {
  const company = useAppSelector((state) => state.company.company);
  const router = useRouter();
  // const { company } = useCompany();
  const theme = getThemeColors(isDarkMode);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState<Partial<PracticeSetting> | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setOrganizationData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading organization settings:', error);
      }
    }
  }, []);

  const handleSubmit = (data: Partial<PracticeSetting>) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setOrganizationData(data);
    setOrganizationModalOpen(false);
  };

  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [mobileSettingsData, setMobileSettingsData] = useState<Partial<MobileSettings> | null>(null);
  const cards = [
    {
      id: 'org',
      icon: Building2,
      title: 'Organization Settings',
      href: company ? ROUTES.SETTINGS(company) + '/organization' : '#',
    },
    {
      id: 'branches',
      icon: MapPin,
      title: 'Branches',
      href: company ? ROUTES.SETTINGS(company) + '/branches' : '#',
    },
    {
      id: 'users',
      icon: Users,
      title: 'Users',
      href: company ? ROUTES.SETTINGS(company) + '/users' : '#',
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: 'Mobile Setting',
      href: company ? ROUTES.SETTINGS(company) + '/mobile' : '#',
    },
    {
      id: 'web',
      icon: Smartphone,
      title: 'Web Setting',
      href: company ? ROUTES.SETTINGS(company) + '/web' : '#',
    },
    {
      id: 'cms',
      icon: FileText,
      title: 'Cms',
      href: company ? ROUTES.SETTINGS(company) + '/cms/pages' : '#',
    },
  ];

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Setting Module',
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <item.icon size={18} className={theme.primary.text} />
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>{item.title}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: () => (
        <div className="flex justify-end items-center gap-2">
          <span className={`text-xs font-semibold ${theme.primary.text}`}>Configure</span>
          <ChevronRight size={16} className={theme.primary.text} />
        </div>
      ),
    },
  ], [isDarkMode, theme]);

  const table = useReactTable({
    data: cards,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      {/* Dashboard Cards Grid */}
      <div className="w-full max-w-7xl mx-auto">
        <GridView
          title="System Settings"
          subtitle="Manage your organization, users and mobile app settings"
          isDarkMode={isDarkMode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          items={cards.map(c => ({ ...c, iconColor: theme.primary.text }))}
          onItemClick={(item) => {
             if (item.href && item.href !== '#') router.push(item.href);
          }}
          table={table}
          itemName="settings"
        />
      </div>
    </div>
  );
};
