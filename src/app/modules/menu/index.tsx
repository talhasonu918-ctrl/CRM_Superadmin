import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DashboardCard } from '../settings/components/DashboardCard';
import { VariantsView } from './VariantsView';
import { AddOnsView } from './AddOnsView';
import { DealsView } from './deals/DealsView';
import {
  LayoutGrid,
  List,
  Users2,
  Plus,
  Tag,
  Package,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { ProductsView } from './products/ProductsView';
import {
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import { getThemeColors } from '../../../theme/colors';
import { GridView } from '../../../components/GridView';

interface MenuModuleProps {
  isDarkMode: boolean;
}

export const MenuModule: React.FC<MenuModuleProps> = ({ isDarkMode }) => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<string>('grid');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get company from route if it exists
  const company = router.query.company as string | undefined;
  const theme = getThemeColors(isDarkMode);

  const handleCardClick = (viewId: string, href?: string) => {
    if (href) {
      // Build the correct route based on whether we have a company parameter
      const targetHref = company ? `/${company}${href}` : href;
      router.push(targetHref);
    } else {
      setActiveView(viewId);
    }
  };

  const menuItems = useMemo(() => [
    {
      id: 'categories',
      title: 'Categories',
      icon: LayoutGrid,
      href: '/product-categories', // Direct navigation
    },
    {
      id: 'variants',
      title: 'Variants',
      icon: Users2,
      component: <VariantsView isDarkMode={isDarkMode} />,
    },
    {
      id: 'add-ons',
      title: 'Add-Ons',
      icon: Plus,
      component: <AddOnsView isDarkMode={isDarkMode} />,
    },
    {
      id: 'deals',
      title: 'Deals',
      icon: Tag,
      component: <DealsView isDarkMode={isDarkMode} />,
    },
    {
      id: 'menu-products',
      title: 'Menu Products',
      icon: Package,
      component: <ProductsView isDarkMode={isDarkMode} />,
    },
  ], [isDarkMode]);

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Module Name',
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
          <span className={`text-xs font-semibold ${theme.primary.text}`}>Open Module</span>
          <ChevronRight size={16} className={theme.primary.text} />
        </div>
      ),
    },
  ], [isDarkMode, theme]);

  const table = useReactTable({
    data: menuItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Find the active component based on state
  const activeItem = menuItems.find((item) => item.id === activeView);

  return (
    <div className="h-full space-y-6">
      {activeView === 'grid' ? (
        <GridView
          title="Menu Management"
          subtitle="Configure products, variants, add-ons and deals"
          isDarkMode={isDarkMode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          items={menuItems.map(m => ({ ...m, iconColor: theme.primary.text }))}
          onItemClick={(item) => handleCardClick(item.id, item.href)}
          table={table}
          itemName="records"
        />
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setActiveView('grid')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`} >
             <ArrowLeft size={20} />
             Back to Menu
          </button>
          {activeItem?.component}
        </div>
      )}
    </div>
  );
};
