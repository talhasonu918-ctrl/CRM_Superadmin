import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DashboardCard } from '../settings/components/DashboardCard';
import { VariantsView } from './VariantsView';
import { AddOnsView } from './AddOnsView';
import { DealsView } from './DealsView';
import {ArrowLeft } from 'lucide-react';
import { MenuProductsView } from './MenuProductsView';
import {
  LayoutGrid,
  Users2,
  Plus,
  Tag,
  Package
} from 'lucide-react';

interface MenuModuleProps {
  isDarkMode: boolean;
}

export const MenuModule: React.FC<MenuModuleProps> = ({ isDarkMode }) => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<string>('grid');
  
  // Get company from route if it exists
  const company = router.query.company as string | undefined;

  const handleCardClick = (viewId: string, href?: string) => {
    if (href) {
      // Build the correct route based on whether we have a company parameter
      const targetHref = company ? `/${company}${href}` : href;
      router.push(targetHref);
    } else {
      setActiveView(viewId);
    }
  };

  const menuItems = [
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
      component: <MenuProductsView isDarkMode={isDarkMode} />,
    },
  ];

  // Find the active component based on state
  const activeItem = menuItems.find((item) => item.id === activeView);

  return (
    <div className="h-full space-y-6">
      {activeView === 'grid' ? (
        <div className="grid gap-4 grid-cols-1 p-5 md:p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {menuItems.map((item) => (
            <DashboardCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              isDarkMode={isDarkMode}
              onClick={() => handleCardClick(item.id, item.href)}
            />
          ))}
        </div>
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
